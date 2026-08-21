import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import recommendations from "@/data/recommendations.json";
import { SectionHeader, type SectionMeta } from "../shared";

export function RecommendationsSection({
  section,
  description,
}: {
  section: SectionMeta;
  description: string;
}) {
  return (
    <>
      <SectionHeader section={section} description={description} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {recommendations.items.map((item) => (
          <Card key={item.priority} className="min-h-[230px]">
            <CardContent className="flex h-full flex-col p-4">
              <div className="flex items-start justify-between gap-3">
                <Badge className="border-primary/30 bg-primary/15 text-primary">
                  P{item.priority}
                </Badge>
                <Badge variant="outline" className="border-border bg-muted/40 text-muted-foreground">
                  {item.category}
                </Badge>
              </div>
              <h3 className="mt-5 text-base font-semibold leading-6 text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
