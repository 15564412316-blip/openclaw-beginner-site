import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">联系我们</h1>
        <p className="text-muted-foreground mb-3">暂时以社群为主，你可以通过以下入口获得帮助：</p>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>
            常见问题：<Link href="/faq" className="text-primary hover:underline">/faq</Link>
          </li>
          <li>
            更新订阅：<Link href="/waitlist" className="text-primary hover:underline">/waitlist</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
