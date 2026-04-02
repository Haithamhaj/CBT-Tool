"use client";

import { useEffect, useMemo, useState } from "react";
import { getReferenceHubEmotionWheel } from "../lib/i18n/reference-hub-emotions";
import type { AppLanguage } from "../lib/i18n/shared";

type EmotionSelection =
  | { type: "core"; groupId: string }
  | { type: "child"; groupId: string; childId: string };

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad)
  };
}

function describeArc(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  const startInner = polarToCartesian(cx, cy, innerRadius, startAngle);
  const endInner = polarToCartesian(cx, cy, innerRadius, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
    "Z"
  ].join(" ");
}

function labelLines(text: string) {
  const words = text.split(" ");
  if (words.length <= 1) {
    return [text];
  }

  if (words.length === 2) {
    return words;
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

export function EmotionWheel({ language }: { language: AppLanguage }) {
  const content = getReferenceHubEmotionWheel(language);
  const [selection, setSelection] = useState<EmotionSelection>({
    type: "core",
    groupId: content.groups[0].id
  });

  useEffect(() => {
    setSelection({ type: "core", groupId: content.groups[0].id });
  }, [content]);

  const selected = useMemo(() => {
    const group = content.groups.find((entry) => entry.id === selection.groupId) ?? content.groups[0];
    if (selection.type === "core") {
      return {
        title: group.name,
        color: group.color,
        definition: group.definition,
        appearsAs: group.appearsAs,
        differsFrom: group.differsFrom,
        example: group.children[0]?.example ?? ""
      };
    }

    const child = group.children.find((entry) => entry.id === selection.childId) ?? group.children[0];
    return {
      title: child.name,
      color: group.color,
      definition: child.definition,
      appearsAs: child.appearsAs,
      differsFrom: child.differsFrom,
      example: child.example
    };
  }, [content.groups, selection]);

  const segments = useMemo(() => {
    const center = 180;
    const outerRadius = 172;
    const middleRadius = 116;
    const innerRadius = 58;
    const coreAngle = 360 / content.groups.length;

    return content.groups.flatMap((group, groupIndex) => {
      const groupStart = groupIndex * coreAngle;
      const groupEnd = groupStart + coreAngle;
      const coreMid = groupStart + coreAngle / 2;
      const coreTextPoint = polarToCartesian(center, center, 87, coreMid);
      const childAngle = coreAngle / group.children.length;

      const coreSegment = {
        key: `${group.id}-core`,
        type: "core" as const,
        id: group.id,
        groupId: group.id,
        path: describeArc(center, center, innerRadius, middleRadius, groupStart, groupEnd),
        fill: group.color,
        label: group.name,
        textPoint: coreTextPoint
      };

      const childSegments = group.children.map((child, childIndex) => {
        const childStart = groupStart + childIndex * childAngle;
        const childEnd = childStart + childAngle;
        const childMid = childStart + childAngle / 2;
        return {
          key: `${group.id}-${child.id}`,
          type: "child" as const,
          id: child.id,
          groupId: group.id,
          path: describeArc(center, center, middleRadius, outerRadius, childStart, childEnd),
          fill: `${group.color}cc`,
          label: child.name,
          textPoint: polarToCartesian(center, center, 145, childMid)
        };
      });

      return [coreSegment, ...childSegments];
    });
  }, [content.groups]);

  return (
    <div className="emotion-wheel-layout">
      <div className="panel stack emotion-wheel-panel">
        <div className="stack" style={{ gap: 6 }}>
          <p className="muted">{content.intro}</p>
          <p className="muted">{content.prompt}</p>
        </div>

        <div className="emotion-wheel-shell">
          <svg viewBox="0 0 360 360" className="emotion-wheel-svg" role="img" aria-label={content.prompt}>
            <circle cx="180" cy="180" r="44" fill="#ffffff" stroke="#d8dee4" strokeWidth="2" />
            <text x="180" y="176" textAnchor="middle" className="emotion-wheel-center-text">
              {content.centerLabel}
            </text>
            <text x="180" y="194" textAnchor="middle" className="emotion-wheel-center-subtext">
              {selection.type === "core" ? content.coreLabel : content.preciseLabel}
            </text>

            {segments.map((segment) => {
              const isActive =
                selection.groupId === segment.groupId &&
                ((selection.type === "core" && segment.type === "core") ||
                  (selection.type === "child" && segment.type === "child" && selection.childId === segment.id));
              const lines = labelLines(segment.label);
              return (
                <g key={segment.key}>
                  <path
                    d={segment.path}
                    fill={segment.fill}
                    stroke={isActive ? "#16202a" : "#ffffff"}
                    strokeWidth={isActive ? 3 : 2}
                    className="emotion-wheel-segment"
                    role="button"
                    aria-pressed={isActive}
                    tabIndex={0}
                    onClick={() =>
                      setSelection(
                        segment.type === "core"
                          ? { type: "core", groupId: segment.groupId }
                          : { type: "child", groupId: segment.groupId, childId: segment.id }
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelection(
                          segment.type === "core"
                            ? { type: "core", groupId: segment.groupId }
                            : { type: "child", groupId: segment.groupId, childId: segment.id }
                        );
                      }
                    }}
                  />
                  <text
                    x={segment.textPoint.x}
                    y={segment.textPoint.y}
                    textAnchor="middle"
                    className={segment.type === "core" ? "emotion-wheel-label core" : "emotion-wheel-label child"}
                    pointerEvents="none"
                  >
                    {lines.map((line, index) => (
                      <tspan
                        key={`${segment.key}-${line}`}
                        x={segment.textPoint.x}
                        dy={index === 0 ? 0 : 11}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <aside className="panel stack emotion-details">
        <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
          <strong>{content.detailsTitle}</strong>
          <span className="emotion-swatch" style={{ backgroundColor: selected.color }} />
        </div>
        <h3 style={{ margin: 0 }}>{selected.title}</h3>
        <div className="stack" style={{ gap: 10 }}>
          <div className="list-item">
            <strong>{content.fields.definition}</strong>
            <div>{selected.definition}</div>
          </div>
          <div className="list-item">
            <strong>{content.fields.appearsAs}</strong>
            <div>{selected.appearsAs}</div>
          </div>
          <div className="list-item">
            <strong>{content.fields.differsFrom}</strong>
            <div>{selected.differsFrom}</div>
          </div>
          <div className="list-item">
            <strong>{content.fields.example}</strong>
            <div>{selected.example}</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
