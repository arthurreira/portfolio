
export interface CardItem {
  id: string | number
  title: string
  description?: string
  image?: string
  size: "small" | "wide" | "tall" | "large"
  
}



export const cardSizes: Record<
  CardItem["size"],
  { cols: string; rows: string }
> = {
  small: {
    cols: "col-span-1",
    rows: "row-span-1",
  },

  wide: {
    cols: "col-span-2",
    rows: "row-span-1",
  },

  tall: {
    cols: "col-span-1",
    rows: "row-span-2",
  },

  large: {
    cols: "col-span-2",
    rows: "row-span-2",
  },
}