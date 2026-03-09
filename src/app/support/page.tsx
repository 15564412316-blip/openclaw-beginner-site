import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        <h1 className="text-3xl font-bold">联系支持</h1>
        <p className="text-muted-foreground">
          先按步骤页的“常见问题”自查；仍无法解决，再带着报错信息来反馈，处理会更快。
        </p>

        <Card className="border-border/50">
          <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
            <p>反馈时请尽量带上：</p>
            <p>• 当前是第几步</p>
            <p>• 报错截图或原文</p>
            <p>• 你已经尝试过的操作</p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/me">去我的页面提交工单</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/install">返回安装总览</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
