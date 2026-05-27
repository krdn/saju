import type { Element } from "../hanja";
import type { Role } from "./shen-strength";

export const PRODUCES: Record<Element, Element> = {
  wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood",
};
export const PRODUCED_BY: Record<Element, Element> = {
  fire: "wood", earth: "fire", metal: "earth", water: "metal", wood: "water",
};
export const CONTROLS: Record<Element, Element> = {
  wood: "earth", fire: "metal", earth: "water", metal: "wood", water: "fire",
};
export const CONTROLLED_BY: Record<Element, Element> = {
  wood: "metal", fire: "water", earth: "wood", metal: "fire", water: "earth",
};

export function classifyRole(dayEl: Element, target: Element): Role {
  if (target === dayEl) return "비겁";
  if (target === PRODUCED_BY[dayEl]) return "인성";
  if (target === PRODUCES[dayEl]) return "식상";
  if (target === CONTROLS[dayEl]) return "재성";
  return "관성";
}

export function roleToElement(dayEl: Element, role: Role): Element {
  switch (role) {
    case "비겁": return dayEl;
    case "인성": return PRODUCED_BY[dayEl];
    case "식상": return PRODUCES[dayEl];
    case "재성": return CONTROLS[dayEl];
    case "관성": return CONTROLLED_BY[dayEl];
  }
}
