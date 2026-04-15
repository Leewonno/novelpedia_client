import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <Container className="py-8">
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <Link
            href="/board/ask"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            문의
          </Link>
          <Link
            href="/board/report"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            신고
          </Link>
          <span className="cursor-default">이용약관</span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-600">
          © 2026 NOVELPEDIA
        </p>
      </Container>
    </footer>
  );
}
