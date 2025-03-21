import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  onToggle: () => void;
  isCollapsed: boolean;
  children: React.ReactNode;
  testId: string;
}

export function FormCard({
  testId,
  title,
  onToggle,
  isCollapsed,
  children,
}: Props) {
  return (
    <Card data-testid={testId}>
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <CardTitle>{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isCollapsed ? <ChevronDown /> : <ChevronUp />}
        </Button>
      </CardHeader>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? "max-h-0 opacity-0" : "opacity-100"
        }`}
      >
        <CardContent>{children}</CardContent>
      </div>
    </Card>
  );
}
