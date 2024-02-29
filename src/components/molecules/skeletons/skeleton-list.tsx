import {type FC, useMemo} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";

export type SkeletonListProps = {
  count: number;
  className?: string;
}

export const SkeletonList: FC<SkeletonListProps> = (props) => {

  const items = useMemo(() => {
    return Array.from({length: props.count}).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full"/>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]"/>
          <Skeleton className="h-4 w-[200px]"/>
        </div>
      </div>
    ));
  }, [props.count]);
  
  return (
    <div className={cn("space-y-5", props.className)}>
      {items}
    </div>
  );
}
