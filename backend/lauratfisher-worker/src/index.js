
import { Resend } from 'resend';
const bcrypt = require('bcryptjs');

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

const testURL = "https://pub-7d691ed4c6f245279280ca86bc185523.r2.dev/"; // real later

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

async function getGallery(request, env) {
  try {
    const stmt = env.DB.prepare("SELECT * FROM lauratfisher_gallery ORDER BY url");
    const { results } = await stmt.all();

    return new Response(JSON.stringify(results, null, 2), {
      status: 200,
      headers: {
        "content-type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (e) {
    console.error("DB or R2 error:", e);
    return new Response("Error: resource not found!", {
      status: 404,
      headers: { ...corsHeaders },
    });
  }
}

async function getAbout(request, env) {
  try {
    const aboutResult = await env.DB.prepare('SELECT about FROM lauratfisher_about LIMIT 1').first();
    const aboutText = aboutResult?.about || '';

    const itemsResult = await env.DB.prepare('SELECT * FROM lauratfisher_links ORDER BY date DESC').all();

    // Combine into one JSON object
    const results = {
      about: aboutText,
      links: itemsResult.results || []
    };

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        "content-type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (e) {
    console.error("DB or R2 error:", e);
    return new Response("Error: resource not found!", {
      status: 404,
      headers: { ...corsHeaders },
    });
  }
}


async function getOpenGraphImage(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml"
      }
    });

    if (!response.ok) return null;

    let ogImage = null;

    const selectors = [
      'meta[property="og:image:secure_url"]',
      'meta[property="og:image:url"]',
      'meta[property="og:image"]',
      'meta[name="og:image"]'
    ];

    const rewriter = new HTMLRewriter();

    for (const selector of selectors) {
      rewriter.on(selector, {
        element(el) {
          if (ogImage) return;
          const content = el.getAttribute("content");
          if (content) ogImage = content;
        }
      });
    }

    // Stream through HTMLRewriter (very important: do not call .text() on response)
    await rewriter.transform(response).arrayBuffer();

    console.log(ogImage);
    
    if (!ogImage) return null;

    // Convert relative URLs to absolute
    try {
      ogImage = new URL(ogImage, url).href;
    } catch {
      // leave as-is if it can't be parsed
    }
    return ogImage;
  } catch (err) {
    console.error("Error fetching OG image:", err);
    return null;
  }
}

async function postConnect(request, env) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return new Response("Malformed POST JSON.", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    const resend = new Resend(env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: "Website Contact <onboarding@resend.dev>", // TODO: CHANGE TO DOMAIN EMAIL AND VERIFY
      to: "tomaszkkmaher@gmail.com",  // TODO: CHANGE TO LAURA EMAIL
      subject: subject || "New contact form submission",
      html: `
        <html>
          <body>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </body>
        </html>
      `
    });

    console.log(response);
  } catch (e) {
    console.error(e);
    return new Response("Failed to send email", { status: 500 });
  }

  return new Response("Email sent", {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}



async function postAbout(request, env) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return new Response("Malformed POST JSON.", {
      status: 400,
      headers: { ...corsHeaders }
    });
  }

  const db = env.DB;

  try {
    const jsonIn = await request.json();
    const incomingLinks = jsonIn.links.map(l => l.link);

    await db.prepare(
      "UPDATE lauratfisher_about SET about = (?) WHERE rowid = 1"
    ).bind(jsonIn.about).run();

    const existingRows = await db.prepare(
      "SELECT link FROM lauratfisher_links"
    ).all();

    const existingLinks = existingRows.results.map(r => r.link);

    for (const dbLink of existingLinks) {
      if (!incomingLinks.includes(dbLink)) {
        await db.prepare(
          "DELETE FROM lauratfisher_links WHERE link = ?"
        ).bind(dbLink).run();
      }
    }

    const fetchRow = db.prepare(
      "SELECT image FROM lauratfisher_links WHERE link = ? LIMIT 1"
    );

    for (const { title, description, link, date } of jsonIn.links) {
      const row = await fetchRow.bind(link).first();
    
      if (row) {
        const existingImage = row.image;
    
        await db.prepare(
          "REPLACE INTO lauratfisher_links (title, description, link, image, date) VALUES (?, ?, ?, ?, ?)"
        ).bind(title, description, link, existingImage, date).run();
    
      } else {
        let image = await getOpenGraphImage(link);
    
        if (!image) {
          image = "https://picsum.photos/536/354";
        }
    
        await db.prepare(
          "INSERT INTO lauratfisher_links (title, description, link, image, date) VALUES (?, ?, ?, ?, ?)"
        ).bind(title, description, link, image, date).run();
      }
    }

    return new Response("Successfully received POST.", {
      status: 200,
      headers: { ...corsHeaders }
    });

  } catch (error) {
    return new Response("Error: " + error.message, { status: 500 });
  }
}

async function postGallery(request, env) {
  const contentType = request.headers.get("content-type");
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();

    const order = JSON.parse(formData.get("order") || "[]");
    const toDelete = JSON.parse(formData.get("delete") || "[]");

    const folder = `lauratfisher/`;

    // 1. Delete removed images
    for (const url of toDelete) {
      console.log("deleting: " + url);
      const key = folder + url.split('/').pop();
      await env.PORTFOLIO_STORAGE.delete(key);
      const galleryRez = await env.DB.prepare('DELETE FROM lauratfisher_gallery WHERE url = ?').bind(url);
      await galleryRez.all();
    }

    let toReplace = [];

    // 1.5 add new images
    let i = 0;
    for (const item of order) {
      const index = String(i).padStart(4, "0");
      const newKey = folder + index + ".jpegA";
      if (item["type"] == "new") {
        const file = formData.get(item["fname"]);
        await env.PORTFOLIO_STORAGE.put(newKey, file.stream(), {
          httpMetadata: { contentType: file.type },
        });
        item["type"] = "existing";
        toReplace.push([newKey, item["description"]]);
      } else if (item["type"] == "newDesc") {
        item["type"] = "existing";
        const galleryRez = await env.DB.prepare('REPLACE INTO lauratfisher_gallery (url, description) VALUES (?, ?)').bind(item["value"], item["description"]);
        await galleryRez.all();
      }
      i += 1;
    }

    // 2. Upload new images with deterministic index names
    i = 0;
    for (const item of order) {
      const filepath = item["value"];
      const index = String(i).padStart(4, "0") + ".jpeg";

      const newKey = folder + index + "A";
      const oldName = filepath.split('/').pop();
      const oldKey = `${folder}${oldName}`;
      if (oldName != index) {
        console.log("oldname:", oldName, "index:", index);
        const object = await env.PORTFOLIO_STORAGE.get(oldKey);
        if (!object) continue;
        const objData = await object.arrayBuffer();
        
        await env.PORTFOLIO_STORAGE.put(newKey, objData);
        await env.PORTFOLIO_STORAGE.delete(oldKey);
        toReplace.push([newKey, item["description"]]);
      }
      i++;
      
    }

    for (const item of toReplace) {
      const name = item[0];
      const description = item[1];
      const newKey = name.slice(0, -1);
      console.log("to replace: " + name + "replacement: " + newKey);
      const object = await env.PORTFOLIO_STORAGE.get(name);
      if (!object) continue;

      const objData = await object.arrayBuffer();
      await env.PORTFOLIO_STORAGE.put(newKey, objData);
      await env.PORTFOLIO_STORAGE.delete(name);

      const galleryRez = await env.DB.prepare('REPLACE INTO lauratfisher_gallery (url, description) VALUES (?, ?)').bind(testURL + newKey, description);
      await galleryRez.all();
    }

    return new Response("Successfully uploaded images.", {
      status: 200,
      headers: { ...corsHeaders },
    });
  } else {
    return new Response("Malformed POST content type.", {
      status: 400,
      headers: { ...corsHeaders },
    });
  }
}

async function hashPassword(password) {
  const salt = "$2b$10$aPWQBpdJECQfzeujfxGgmu";
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function checkLogin(passwordIn) {
  const hashedPassword = "$2b$10$aPWQBpdJECQfzeujfxGgmuCueOLGeqkr.lBjMcg49bpKRgXf2/zVO";
  if (passwordIn == null) {
    return false;
  }
  try {
    const hashedIn = await hashPassword(passwordIn);
    console.log("Hashed password in:", hashedIn);
    console.log("Hashed password correct:", hashedPassword);
    return hashedIn == hashedPassword;
  } catch (error) {
    console.error("Failed to hash password in main:", error);
    return false;
  }
  
}


export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const passwordIn = url.searchParams.get('password');
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
        }
      });
    }

    if (method === "GET") {
      if (page == "about") {
        return getAbout(request, env);
      } else {
        return getGallery(request, env);
      }
    } else if (method === "POST") {
      if (page == "connect") {
        return postConnect(request, env);
      }
      console.log("checking: ", passwordIn);
      if (await checkLogin(passwordIn) == false) {
        return new Response("Invalid credentials.", {
          status: 401,
          headers: { ...corsHeaders },
        });
      }

      if (page == "about") {
        return postAbout(request, env);
      } else if (page == "login") {
        return new Response("Login successful.", {
          status: 200,
          headers: { ...corsHeaders },
        });
      } else {
        return postGallery(request, env);
      }
    } else {
      return new Response(`Unsupported method: ${method}`, {
        status: 405,
        headers: corsHeaders,
      });
    }
  },
};
