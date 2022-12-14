import { Badge } from "@mantine/core";
import { forwardRef } from "react";

interface Props {
  color: string;
  value: string;
}
const LabelSelectItem = forwardRef<HTMLDivElement, Props>(
  ({ color, value,...others }: Props, ref) => (
    <div ref={ref} {...others}>
      <Badge
      
      
    sx={() => ({
      borderColor: "#" + color,
      color: "#" + color,
    })}
    variant="outline"
  >
    {value}
  </Badge>
    </div>
  )
);

export default LabelSelectItem;
