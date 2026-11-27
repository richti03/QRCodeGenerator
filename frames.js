const framePadding = 28;
const frameStyles = [
    { id: "", name: "Ohne Rahmen" },
    { id: "gallery", name: "Galerie" },
    { id: "ticket", name: "Ticket", footer: 32, defaultText: "Scan mich" },
    { id: "neon", name: "Neon" },
    { id: "focus", name: "Fokus" },
    { id: "retro", name: "Retro" },
    { id: "orbit", name: "Orbit" },
    { id: "stamp", name: "Briefmarke" },
    { id: "badge", name: "Plakette" },
    { id: "film", name: "Filmstreifen" },
    { id: "caption", name: "Scan mich", footer: 34, defaultText: "Scan mich" },
    { id: "ribbon", name: "Banderole", footer: 34, defaultText: "Scan mich" },
    { id: "speech", name: "Sprechblase", footer: 39, defaultText: "Scan mich" },
    { id: "arch", name: "Spitzbogen" },
    { id: "deco", name: "Art déco" },
    { id: "confetti", name: "Konfetti" },
    { id: "arrow", name: "Scan-Pfeil", padding: 5, gutter: 64, topMargin: 16, rightMargin: 32,
        footer: 72, defaultText: "Scan me" }
];

function frameBox(context, x, y, width, height, radius, paint) {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    paint.call(context);
}

function frameLine(context, points, close = false) {
    context.beginPath();
    context.moveTo(...points[0]);
    for (const point of points.slice(1)) {
        context.lineTo(...point);
    }
    if (close) {
        context.closePath();
    }
}

function frameDot(context, x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}

function frameLabel(context, label, x, y, width, color) {
    context.fillStyle = color;
    context.font = "700 20px system-ui, sans-serif";
    context.textBaseline = "middle";
    context.textAlign = "center";
    const naturalWidth = context.measureText(label).width;
    if (naturalWidth > width) {
        context.font = `700 ${20 * width / naturalWidth}px system-ui, sans-serif`;
    }
    context.fillText(label, x, y, width);
}

function drawFrame(context, frame, width, height, ink, background, label) {
    if (!frame.id) {
        return;
    }

    const middle = width / 2;
    const bottom = height - 10;
    const padding = frame.padding ?? framePadding;
    const gutter = frame.gutter ?? 0;
    // Keep frame artwork out of the QR code and its quiet zone.
    const clip = new Path2D();
    clip.rect(-gutter, 0, width + gutter, height + 24);
    clip.rect(padding, padding, width - 2 * padding, width - 2 * padding);
    context.save();
    context.clip(clip, "evenodd");
    context.fillStyle = ink;
    context.strokeStyle = ink;
    context.lineJoin = "round";

    switch (frame.id) {
        case "gallery":
            context.lineWidth = 5;
            context.strokeRect(11, 11, width - 22, height - 22);
            context.lineWidth = 1.5;
            context.strokeRect(21, 21, width - 42, height - 42);
            break;

        case "ticket": {
            const tearLine = bottom - 43;
            context.lineWidth = 3;
            frameBox(context, 10, 10, width - 20, height - 20, 18, context.stroke);
            frameBox(context, 10, tearLine, width - 20, 43, [0, 0, 18, 18], context.fill);
            context.save();
            context.strokeStyle = background;
            context.setLineDash([5, 5]);
            frameLine(context, [[26, tearLine + 4], [width - 26, tearLine + 4]]);
            context.stroke();
            context.fillStyle = background;
            frameDot(context, 10, tearLine, 9);
            frameDot(context, width - 10, tearLine, 9);
            context.restore();
            frameLabel(context, label, middle, tearLine + 24, width - 52, background);
            break;
        }

        case "neon":
            context.globalAlpha = 0.15;
            context.lineWidth = 18;
            frameBox(context, 19, 19, width - 38, height - 38, 32, context.stroke);
            context.globalAlpha = 0.28;
            context.lineWidth = 10;
            frameBox(context, 19, 19, width - 38, height - 38, 32, context.stroke);
            context.globalAlpha = 1;
            context.lineWidth = 3;
            frameBox(context, 19, 19, width - 38, height - 38, 32, context.stroke);
            break;

        case "focus":
            context.lineWidth = 7;
            context.lineCap = "round";
            for (const [x, y, dx, dy] of [
                [14, 14, 1, 1], [width - 14, 14, -1, 1],
                [14, bottom - 4, 1, -1], [width - 14, bottom - 4, -1, -1]
            ]) {
                frameLine(context, [[x, y + 48 * dy], [x, y + 12 * dy],
                    [x + 12 * dx, y], [x + 48 * dx, y]]);
                context.stroke();
            }
            context.lineWidth = 2;
            frameLine(context, [[middle - 15, 14], [middle + 15, 14]]);
            context.stroke();
            frameLine(context, [[middle - 15, bottom - 4], [middle + 15, bottom - 4]]);
            context.stroke();
            break;

        case "retro":
            context.lineWidth = 7;
            frameLine(context, [[width - 9, 20], [width - 9, height - 9], [20, height - 9]]);
            context.stroke();
            context.lineWidth = 3;
            frameBox(context, 9, 9, width - 27, height - 27, 8, context.stroke);
            for (const x of [23, 34, 45]) {
                frameDot(context, x, 23, 3);
            }
            break;

        case "orbit":
            context.lineWidth = 2;
            context.beginPath();
            context.ellipse(middle, height / 2, middle - 14, height / 2 - 14, 0, 0, 2 * Math.PI);
            context.stroke();
            for (const [x, y, radius] of [
                [middle - 53, 17, 7], [width - 17, height / 2 - 52, 5],
                [middle + 54, bottom - 7, 8], [16, height / 2 + 46, 4]
            ]) {
                frameDot(context, x, y, radius);
            }
            break;

        case "stamp":
            context.lineWidth = 7;
            context.lineCap = "round";
            context.setLineDash([1, 11]);
            frameBox(context, 13, 13, width - 26, height - 26, 5, context.stroke);
            context.setLineDash([]);
            context.lineWidth = 2;
            context.strokeRect(24, 24, width - 48, height - 48);
            break;

        case "badge":
            context.lineWidth = 10;
            frameLine(context, [[36, 11], [width - 36, 11], [width - 11, 36],
                [width - 11, height - 36], [width - 36, height - 11],
                [36, height - 11], [11, height - 36], [11, 36]], true);
            context.stroke();
            for (const x of [23, width - 23]) {
                for (const y of [23, height - 23]) {
                    frameDot(context, x, y, 4);
                }
            }
            break;

        case "film":
            context.lineWidth = 2;
            frameBox(context, 9, 9, width - 18, height - 18, 8, context.stroke);
            for (const x of [8, width - 28]) {
                frameBox(context, x, 9, 20, height - 18, 6, context.fill);
            }
            context.fillStyle = background;
            for (let y = 24; y < height - 26; y += 26) {
                for (const center of [18, width - 18]) {
                    frameBox(context, center - 5, y, 10, 14, 3, context.fill);
                }
            }
            break;

        case "caption":
            context.lineWidth = 6;
            frameBox(context, 10, 10, width - 20, height - 20, 30, context.stroke);
            frameBox(context, 10, bottom - 46, width - 20, 46, [0, 0, 30, 30], context.fill);
            frameLabel(context, label, middle, bottom - 24, width - 52, background);
            break;

        case "ribbon": {
            const top = bottom - 34;
            context.lineWidth = 3;
            frameBox(context, 16, 12, width - 32, top - 9, 12, context.stroke);
            frameLine(context, [
                [6, top + 5], [24, top + 5], [24, top], [width - 24, top],
                [width - 24, top + 5], [width - 6, top + 5], [width - 16, top + 22],
                [width - 6, bottom + 5], [width - 28, bottom + 3], [width - 28, bottom],
                [28, bottom], [28, bottom + 3], [6, bottom + 5], [16, top + 22]
            ], true);
            context.fill();
            frameLabel(context, label, middle, top + 17, width - 64, background);
            break;
        }

        case "speech": {
            const band = bottom - 49;
            context.lineWidth = 4;
            frameBox(context, 12, 11, width - 24, bottom - 28, 28, context.stroke);
            frameBox(context, 12, band, width - 24, 34, [0, 0, 24, 24], context.fill);
            frameLine(context, [[43, bottom - 20], [74, bottom - 20], [45, bottom + 4]], true);
            context.fill();
            frameLabel(context, label, middle, band + 17, width - 58, background);
            break;
        }

        case "arch":
            context.lineWidth = 4;
            frameLine(context, [[10, height - 12], [10, 25], [middle, 6],
                [width - 10, 25], [width - 10, height - 12]], true);
            context.stroke();
            context.lineWidth = 1.5;
            frameLine(context, [[20, 27], [middle, 15], [width - 20, 27]]);
            context.stroke();
            break;

        case "deco":
            context.lineWidth = 2;
            for (const inset of [8, 16, 24]) {
                const step = 32 - inset;
                frameLine(context, [[inset + step, inset], [width - inset - step, inset],
                    [width - inset, inset + step], [width - inset, height - inset - step],
                    [width - inset - step, height - inset], [inset + step, height - inset],
                    [inset, height - inset - step], [inset, inset + step]], true);
                context.stroke();
            }
            break;

        case "confetti":
            context.lineWidth = 2;
            frameBox(context, 23, 23, width - 46, height - 46, 10, context.stroke);
            for (const [x, y, dx, dy] of [
                [0, 0, 1, 1], [width, 0, -1, 1],
                [0, height, 1, -1], [width, height, -1, -1]
            ]) {
                frameDot(context, x + 15 * dx, y + 14 * dy, 4);
                frameDot(context, x + 55 * dx, y + 12 * dy, 2.5);
                frameLine(context, [[x + 34 * dx, y + 6 * dy], [x + 39 * dx, y + 16 * dy]]);
                context.stroke();
                frameLine(context, [[x + 6 * dx, y + 34 * dy], [x + 16 * dx, y + 39 * dy]]);
                context.stroke();
            }
            break;

        case "arrow": {
            context.lineWidth = 1.25;
            frameBox(context, 1, 1, width - 2, width - 2, 6, context.stroke);

            const tipY = width * 0.49;
            context.beginPath();
            context.moveTo(-24, bottom - 14);
            context.bezierCurveTo(-63, width - 3, -56, tipY + 48, -15, tipY + 5);
            context.lineWidth = 5;
            context.lineCap = "round";
            context.stroke();
            frameLine(context, [[-39, tipY + 7], [-10, tipY], [-16, tipY + 28], [-22, tipY + 13]], true);
            context.fill();

            const font = '"Snell Roundhand", "Segoe Script", "Brush Script MT", cursive';
            context.textAlign = "left";
            context.textBaseline = "alphabetic";
            const fontSize = 66;
            context.font = `italic 700 ${fontSize}px ${font}`;
            const original = context.measureText(label);
            const textWidth = original.actualBoundingBoxLeft + original.actualBoundingBoxRight;
            const textHeight = original.actualBoundingBoxAscent + original.actualBoundingBoxDescent;
            const scale = Math.min(1, width * 0.84 / textWidth, 51 / textHeight);
            if (scale < 1) {
                context.font = `italic 700 ${fontSize * scale}px ${font}`;
            }
            const metrics = context.measureText(label);
            const x = middle + (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2;
            const y = width + 8 + metrics.actualBoundingBoxAscent;
            context.fillText(label, x, y);
            break;
        }
    }

    if (label && !frame.footer) {
        const badgeWidth = width - 60;
        const x = (width - badgeWidth) / 2;
        context.fillStyle = ink;
        frameBox(context, x, height - 20, badgeWidth, 34, 17, context.fill);
        frameLabel(context, label, middle, height - 3, badgeWidth - 24, background);
    }
    context.restore();
}
