/* Copyright 2024 Marimo. All rights reserved. */
import { CellId, HTMLCellId } from "@/core/cells/ids";
import { Logger } from "../../../utils/Logger";
import { cn } from "@/utils/cn";
import { displayCellName } from "@/core/cells/names";
import { useCellIds, useCellNames } from "@/core/cells/cells";

interface Props {
  cellId: CellId;
  className?: string;
  onClick?: () => void;
  variant?: "destructive" | "focus";
}

/* Component that adds a link to a cell, with styling. */
export const CellLink = (props: Props): JSX.Element => {
  const { className, cellId, variant, onClick } = props;
  const cellName = useCellNames()[cellId] ?? "";
  const cellIndex = useCellIds().indexOf(cellId);

  return (
    <div
      className={cn(
        "inline-block cursor-pointer text-[var(--blue-10)] hover:underline",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const succeeded = scrollToCell(cellId, variant);
        if (succeeded) {
          onClick?.();
        }
      }}
    >
      {displayCellName(cellName, cellIndex)}
    </div>
  );
};

/* Component that adds a link to a cell, for use in a MarimoError. */
export const CellLinkError = (
  props: Pick<Props, "className" | "cellId">,
): JSX.Element => {
  return <CellLink {...props} variant={"destructive"} />;
};

export function scrollToCell(
  cellId: CellId,
  variant?: "destructive" | "focus",
): boolean {
  const cellHtmlId = HTMLCellId.create(cellId);
  const cell: HTMLElement | null = document.getElementById(cellHtmlId);

  if (cell === null) {
    Logger.error(`Cell ${cellHtmlId} not found on page.`);
    return false;
  } else {
    cell.scrollIntoView({ behavior: "smooth", block: "center" });

    if (variant === "destructive") {
      cell.classList.add("error-outline");
      setTimeout(() => {
        cell.classList.remove("error-outline");
      }, 1500);
    }
    if (variant === "focus") {
      cell.classList.add("focus-outline");
      setTimeout(() => {
        cell.classList.remove("focus-outline");
      }, 1500);
    }

    return true;
  }
}
