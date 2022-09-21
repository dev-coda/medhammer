import Link from "next/link"
import styles from "./footer.module.css"
import packageJSON from "../package.json"

export default function Footer() {
  return (
    <footer className={styles.footer}>
     Copyright {new Date().getFullYear()} -  Por <a href="http://dcorrea.co" target="_blank" rel="noopener noreferrer">dcorrea.co</a>
    </footer>
  )
}
