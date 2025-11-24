import PortfolioDisplay from "@/src/components/portfolio/portfolio";
import Image from "next/image";
import Link from "next/link";
import Menu from "../../src/components/menu";


export default function Portfolio() {
  return (
    <>
      <PortfolioDisplay/>
      <Menu/>
    </>
  );
}
