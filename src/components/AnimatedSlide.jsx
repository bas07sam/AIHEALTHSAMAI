import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Pause } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/* ═══════════════════════════════════════════════════════════════════
   AnimatedSlide — Full-screen HTML5 Canvas + CSS Animations
   that live BETWEEN PDF slides inside the module viewer.

   Props:
     animationId  – which animation to show (string key)
     title        – heading displayed above the canvas
     description  – optional explanatory text below
   ═══════════════════════════════════════════════════════════════════ */

/* ── colour palette ── */
const COLORS = {
  bg:        '#f8fafc',
  card:      '#ffffff',
  primary:   '#0891b2',  // cyan-600
  accent:    '#f59e0b',  // amber-500
  success:   '#10b981',  // emerald-500
  error:     '#ef4444',
  text:      '#1e293b',
  muted:     '#94a3b8',
  trad:      '#6366f1',  // indigo for "traditional"
  ai:        '#06b6d4',  // cyan for "AI"
  gridLine:  '#e2e8f0',
  pulse:     '#8b5cf6',  // violet pulse
};

/* ────────────────────────────────────────────────────────────────
   1. Traditional Automation Animation
   Shows a rigid, linear conveyor belt: fixed boxes go through
   identical stamping steps → only "structured" boxes pass.
   ──────────────────────────────────────────────────────────────── */
function drawTraditionalAutomation(ctx, w, h, frame, t) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w / 900, h / 560);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Background grid
  ctx.strokeStyle = COLORS.gridLine;
  ctx.lineWidth = 0.5;
  for (let x = -450; x <= 450; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, -280); ctx.lineTo(x, 280); ctx.stroke();
  }
  for (let y = -280; y <= 280; y += 40) {
    ctx.beginPath(); ctx.moveTo(-450, y); ctx.lineTo(450, y); ctx.stroke();
  }

  // Title
  ctx.fillStyle = COLORS.trad;
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillText('الأتمتة التقليدية', 0, -230);
  ctx.font = '14px Inter, system-ui, sans-serif';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText('قواعد ثابتة · بيانات مهيكلة · تدفق خطي', 0, -205);

  // Conveyor belt
  const beltY = 30;
  const beltH = 12;
  ctx.fillStyle = '#cbd5e1';
  roundRect(ctx, -380, beltY - beltH / 2, 760, beltH, 6);
  ctx.fill();

  // Conveyor dashes (moving)
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = -frame * 2;
  ctx.beginPath();
  ctx.moveTo(-380, beltY);
  ctx.lineTo(380, beltY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Processing stations
  const stations = [
    { x: -250, label: 'إذا / إذن', icon: '⚙️' },
    { x: -80,  label: 'تحقق', icon: '✓' },
    { x: 90,   label: 'ختم',    icon: '📋' },
    { x: 260,  label: 'مخرج',   icon: '📤' },
  ];

  stations.forEach((s, i) => {
    // Station box
    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = COLORS.trad;
    ctx.lineWidth = 2;
    roundRect(ctx, s.x - 55, beltY - 90, 110, 60, 8);
    ctx.fill();
    ctx.stroke();

    // Station label
    ctx.fillStyle = COLORS.trad;
    ctx.font = 'bold 12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.label, s.x, beltY - 48);

    // Icon
    ctx.font = '20px serif';
    ctx.fillText(s.icon, s.x, beltY - 65);

    // Arm dropping down (animated piston)
    const armPhase = ((frame + i * 15) % 60) / 60;
    const armExt = Math.sin(armPhase * Math.PI) * 18;
    ctx.strokeStyle = COLORS.trad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(s.x, beltY - 30);
    ctx.lineTo(s.x, beltY - 12 + armExt);
    ctx.stroke();
    // piston head
    ctx.fillStyle = COLORS.trad;
    ctx.fillRect(s.x - 8, beltY - 14 + armExt, 16, 4);
  });

  // Items travelling on the belt
  const items = [
    { shape: 'rect', color: '#a5b4fc', label: 'CSV', structured: true },
    { shape: 'circle', color: '#fca5a5', label: '📷', structured: false },
    { shape: 'rect', color: '#a5b4fc', label: 'نموذج', structured: true },
    { shape: 'blob', color: '#fca5a5', label: '💬', structured: false },
    { shape: 'rect', color: '#a5b4fc', label: 'جدول', structured: true },
  ];

  items.forEach((item, i) => {
    const speed = 1.2;
    let posX = ((frame * speed + i * 180) % 900) - 420;

    // Reject unstructured items at the validate station (posX ~ -80)
    const rejected = !item.structured && posX > -100;

    const iy = rejected ? beltY + 60 + Math.min((posX + 100) * 0.5, 60) : beltY;

    ctx.globalAlpha = rejected ? Math.max(0.3, 1 - (posX + 100) / 200) : 1;

    if (item.shape === 'rect') {
      ctx.fillStyle = item.color;
      roundRect(ctx, posX - 20, iy - 30, 40, 22, 4);
      ctx.fill();
    } else if (item.shape === 'circle') {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(posX, iy - 19, 12, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.moveTo(posX - 12, iy - 10);
      ctx.quadraticCurveTo(posX, iy - 30, posX + 12, iy - 10);
      ctx.quadraticCurveTo(posX, iy - 16, posX - 12, iy - 10);
      ctx.fill();
    }

    ctx.fillStyle = COLORS.text;
    ctx.font = item.structured ? '9px Inter, sans-serif' : '14px serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, posX, iy - 15);
    ctx.globalAlpha = 1;

    // Red X for rejected
    if (rejected && posX > -90 && posX < 100) {
      ctx.fillStyle = COLORS.error;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('✗', posX, iy - 35);
    }
  });

  // Bottom legend
  ctx.fillStyle = COLORS.muted;
  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ البيانات المهيكلة تمر  ·  ✗ البيانات غير المهيكلة تُرفض', 0, beltY + 140);

  // Limitations callout
  ctx.fillStyle = '#fef3c7';
  roundRect(ctx, -180, beltY + 160, 360, 44, 8);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  roundRect(ctx, -180, beltY + 160, 360, 44, 8);
  ctx.stroke();
  ctx.fillStyle = '#92400e';
  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.fillText('⚠ لا يمكنها التعامل مع الصور أو البريد أو النصوص غير المهيكلة', 0, beltY + 184);

  ctx.restore();
}

/* ────────────────────────────────────────────────────────────────
   2. AI Automation Animation
   Shows an intelligent hub: data of ALL types flows in,
   a central "AI brain" processes, classifies, routes adaptively.
   ──────────────────────────────────────────────────────────────── */
function drawAIAutomation(ctx, w, h, frame, t) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w / 900, h / 560);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Background subtle radial
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 420);
  grad.addColorStop(0, '#ecfeff');
  grad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = grad;
  ctx.fillRect(-450, -280, 900, 560);

  // Title
  ctx.fillStyle = COLORS.ai;
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillText('أتمتة الذكاء الاصطناعي', 0, -230);
  ctx.font = '14px Inter, system-ui, sans-serif';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText('مدركة للسياق · تكيفية · تتعامل مع أي بيانات', 0, -205);

  // Central AI brain
  const brainPulse = 46 + Math.sin(frame * 0.05) * 4;
  // Outer glow
  const glowGrad = ctx.createRadialGradient(0, -20, brainPulse - 10, 0, -20, brainPulse + 30);
  glowGrad.addColorStop(0, 'rgba(6,182,212,0.25)');
  glowGrad.addColorStop(1, 'rgba(6,182,212,0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, -20, brainPulse + 30, 0, Math.PI * 2);
  ctx.fill();

  // Brain circle
  const brainGrad = ctx.createLinearGradient(-50, -70, 50, 30);
  brainGrad.addColorStop(0, '#06b6d4');
  brainGrad.addColorStop(1, '#0891b2');
  ctx.fillStyle = brainGrad;
  ctx.beginPath();
  ctx.arc(0, -20, brainPulse, 0, Math.PI * 2);
  ctx.fill();

  // Brain icon (🧠)
  ctx.fillStyle = '#ffffff';
  ctx.font = '36px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧠', 0, -22);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillText('محرك الذكاء', 0, 12);

  // Input sources (left side)
  const inputs = [
    { y: -140, label: 'بريد', icon: '📧', color: '#818cf8' },
    { y: -60,  label: 'صور', icon: '📷', color: '#f472b6' },
    { y: 20,   label: 'نماذج',  icon: '📋', color: '#34d399' },
    { y: 100,  label: 'صوت',  icon: '🎤', color: '#fbbf24' },
    { y: 180,  label: 'محادثة',   icon: '💬', color: '#a78bfa' },
  ];

  inputs.forEach((inp, i) => {
    const baseX = -340;

    // Input box
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = inp.color;
    ctx.lineWidth = 2;
    roundRect(ctx, baseX - 55, inp.y - 22, 110, 44, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '18px serif';
    ctx.fillStyle = inp.color;
    ctx.textAlign = 'center';
    ctx.fillText(inp.icon, baseX - 25, inp.y + 7);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = COLORS.text;
    ctx.fillText(inp.label, baseX + 20, inp.y + 5);

    // Animated data particle flying to brain
    const particleProgress = ((frame * 1.5 + i * 40) % 120) / 120;
    const startX = baseX + 55;
    const startY = inp.y;
    const endX = -brainPulse - 5;
    const endY = -20;

    // Bezier curve path
    const cp1x = startX + (endX - startX) * 0.3;
    const cp1y = startY;
    const cp2x = startX + (endX - startX) * 0.7;
    const cp2y = endY;

    const pt = bezierPoint(startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY, particleProgress);

    ctx.fillStyle = inp.color;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Connection line (faint)
    ctx.strokeStyle = inp.color;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Output actions (right side)
  const outputs = [
    { y: -120, label: 'تصنيف', icon: '🏷️', color: '#06b6d4' },
    { y: -30,  label: 'تلخيص', icon: '📝', color: '#10b981' },
    { y: 60,   label: 'تنبيه', icon: '🔔', color: '#f59e0b' },
    { y: 150,  label: 'توجيه', icon: '🔀', color: '#8b5cf6' },
  ];

  outputs.forEach((out, i) => {
    const baseX = 340;

    ctx.fillStyle = '#f0fdfa';
    ctx.strokeStyle = out.color;
    ctx.lineWidth = 2;
    roundRect(ctx, baseX - 55, out.y - 22, 110, 44, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '18px serif';
    ctx.fillStyle = out.color;
    ctx.textAlign = 'center';
    ctx.fillText(out.icon, baseX - 25, out.y + 7);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = COLORS.text;
    ctx.fillText(out.label, baseX + 20, out.y + 5);

    // Particle from brain to output
    const particleProgress = ((frame * 1.5 + i * 35 + 60) % 120) / 120;
    const startX = brainPulse + 5;
    const startY = -20;
    const endX = baseX - 55;
    const endY = out.y;

    const cp1x = startX + (endX - startX) * 0.3;
    const cp1y = startY;
    const cp2x = startX + (endX - startX) * 0.7;
    const cp2y = endY;

    const pt = bezierPoint(startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY, particleProgress);

    ctx.fillStyle = out.color;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Connection line
    ctx.strokeStyle = out.color;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Bottom capabilities
  const caps = ['معالجة اللغة', 'رؤية حاسوبية', 'اتخاذ القرار', 'تعلم تكيفي'];
  caps.forEach((cap, i) => {
    const bx = -230 + i * 153;
    const by = 220;
    ctx.fillStyle = '#ecfeff';
    ctx.strokeStyle = COLORS.ai;
    ctx.lineWidth = 1;
    roundRect(ctx, bx - 60, by - 12, 120, 24, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.ai;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cap, bx, by + 4);
  });

  ctx.restore();
}

/* ────────────────────────────────────────────────────────────────
   3. Workflow Animation
   A flowing pipeline: Trigger → Action → Condition → Action → Output
   with animated tokens moving through each stage.
   ──────────────────────────────────────────────────────────────── */
function drawWorkflow(ctx, w, h, frame, t) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w / 900, h / 520);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Title
  ctx.fillStyle = COLORS.primary;
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillText('مكونات سير العمل', 0, -220);
  ctx.font = '14px Inter, system-ui, sans-serif';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText('محفز ← إجراء ← شرط ← إجراء ← مخرج', 0, -195);

  // Workflow nodes
  const nodes = [
    { x: -330, y: 0, w: 120, h: 80, label: 'محفز', sub: 'المريض يقدم\nطلب موعد', color: '#8b5cf6', icon: '⚡' },
    { x: -160, y: 0, w: 120, h: 80, label: 'إجراء', sub: 'فحص التقويم\nوالمواعيد', color: '#06b6d4', icon: '⚙️' },
    { x: 10,   y: 0, w: 120, h: 80, label: 'شرط', sub: 'هل الموعد\nالمفضل متاح؟', color: '#f59e0b', icon: '❓', isDiamond: true },
    { x: 180,  y: 0, w: 120, h: 80, label: 'إجراء', sub: 'تأكيد أو\nاقتراح بدائل', color: '#06b6d4', icon: '⚙️' },
    { x: 340,  y: 0, w: 120, h: 80, label: 'مخرج', sub: 'إرسال إشعار\nالتأكيد', color: '#10b981', icon: '📤' },
  ];

  // Draw connection arrows
  for (let i = 0; i < nodes.length - 1; i++) {
    const from = nodes[i];
    const to = nodes[i + 1];
    const fromX = from.x + from.w / 2 + 5;
    const toX = to.x - to.w / 2 - 5;

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX, from.y);
    ctx.lineTo(toX, to.y);
    ctx.stroke();

    // Arrow head
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(toX, to.y);
    ctx.lineTo(toX - 8, to.y - 5);
    ctx.lineTo(toX - 8, to.y + 5);
    ctx.closePath();
    ctx.fill();
  }

  // Condition branches (Yes/No)
  const condNode = nodes[2];
  // "Yes" path (straight) label
  ctx.fillStyle = COLORS.success;
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('نعم', (condNode.x + nodes[3].x) / 2, condNode.y - 18);

  // "No" branch (goes down)
  ctx.strokeStyle = COLORS.error;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(condNode.x, condNode.y + condNode.h / 2 + 5);
  ctx.lineTo(condNode.x, condNode.y + 90);
  ctx.lineTo(condNode.x + 50, condNode.y + 90);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = COLORS.error;
  ctx.font = 'bold 10px Inter, sans-serif';
  ctx.fillText('لا', condNode.x - 14, condNode.y + 65);

  // "Suggest alternatives" box on no branch
  ctx.fillStyle = '#fef2f2';
  ctx.strokeStyle = COLORS.error;
  ctx.lineWidth = 1.5;
  roundRect(ctx, condNode.x + 10, condNode.y + 72, 110, 36, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = COLORS.error;
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('اقتراح مواعيد', condNode.x + 65, condNode.y + 89);
  ctx.fillText('بديلة متاحة', condNode.x + 65, condNode.y + 101);

  // Draw nodes
  nodes.forEach((node, i) => {
    // Highlight current active node based on frame
    const activeIdx = Math.floor((frame % 200) / 40);
    const isActive = activeIdx === i;

    if (node.isDiamond) {
      // Diamond shape
      ctx.save();
      ctx.translate(node.x, node.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = isActive ? node.color : '#fffbeb';
      roundRect(ctx, -30, -30, 60, 60, 6);
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      roundRect(ctx, -30, -30, 60, 60, 6);
      ctx.stroke();
      ctx.restore();

      ctx.font = '20px serif';
      ctx.fillStyle = isActive ? '#fff' : node.color;
      ctx.textAlign = 'center';
      ctx.fillText(node.icon, node.x, node.y + 4);
    } else {
      // Rounded rectangle
      if (isActive) {
        // Glow
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 15;
      }
      ctx.fillStyle = isActive ? node.color : '#f8fafc';
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2;
      roundRect(ctx, node.x - node.w / 2, node.y - node.h / 2, node.w, node.h, 12);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Icon
      ctx.font = '22px serif';
      ctx.fillStyle = isActive ? '#fff' : node.color;
      ctx.textAlign = 'center';
      ctx.fillText(node.icon, node.x, node.y - 12);

      // Label
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = isActive ? '#fff' : COLORS.text;
      ctx.fillText(node.label, node.x, node.y + 8);

      // Sub text
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = isActive ? 'rgba(255,255,255,0.8)' : COLORS.muted;
      const lines = node.sub.split('\n');
      lines.forEach((line, li) => {
        ctx.fillText(line, node.x, node.y + 22 + li * 12);
      });
    }
  });

  // Animated token moving through
  const totalPath = 680;
  const tokenPos = (frame * 2) % (totalPath + 80) - 40;
  const tokenX = -330 - 60 + tokenPos;
  const tokenY = 0;

  if (tokenX > -400 && tokenX < 420) {
    ctx.fillStyle = '#06b6d4';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(tokenX, tokenY - 55, 7, 0, Math.PI * 2);
    ctx.fill();
    // Trail
    for (let tr = 1; tr <= 4; tr++) {
      ctx.globalAlpha = 0.2 - tr * 0.04;
      ctx.beginPath();
      ctx.arc(tokenX - tr * 12, tokenY - 55, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Legend
  const legendItems = [
    { color: '#8b5cf6', label: 'محفز' },
    { color: '#06b6d4', label: 'إجراء' },
    { color: '#f59e0b', label: 'شرط' },
    { color: '#10b981', label: 'مخرج' },
  ];
  legendItems.forEach((item, i) => {
    const lx = -200 + i * 120;
    const ly = 160;
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(lx - 6, ly, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.text;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, lx + 4, ly + 4);
  });

  ctx.restore();
}

/* ────────────────────────────────────────────────────────────────
   4. AI Agent Animation
   Shows a central agent with perception → reasoning → action loop,
   environment interaction, and tool-use visualization.
   ──────────────────────────────────────────────────────────────── */
function drawAIAgent(ctx, w, h, frame, t) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w / 900, h / 560);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Title
  ctx.fillStyle = '#8b5cf6';
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillText('وكيل الذكاء الاصطناعي — الإدراك، التفكير، التنفيذ', 0, -240);
  ctx.font = '14px Inter, system-ui, sans-serif';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText('أنظمة موجهة بالأهداف تتكيف وتتعلم', 0, -215);

  // Central Agent ring
  const ringR = 70;
  const ringPulse = Math.sin(frame * 0.04) * 3;

  // Outer ring glow
  ctx.strokeStyle = 'rgba(139,92,246,0.2)';
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.arc(0, 10, ringR + ringPulse + 15, 0, Math.PI * 2);
  ctx.stroke();

  // Main ring
  const ringGrad = ctx.createLinearGradient(-80, -60, 80, 80);
  ringGrad.addColorStop(0, '#8b5cf6');
  ringGrad.addColorStop(1, '#6d28d9');
  ctx.fillStyle = ringGrad;
  ctx.beginPath();
  ctx.arc(0, 10, ringR + ringPulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = '40px serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('🤖', 0, 6);
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillText('وكيل ذكي', 0, 44);

  // Three phases around the ring
  const phases = [
    { angle: -Math.PI / 2 - 0.8, label: 'إدراك', icon: '👁️', color: '#06b6d4', desc: 'مراقبة البيئة' },
    { angle: -Math.PI / 2 + 0.8, label: 'تفكير', icon: '💡', color: '#f59e0b', desc: 'تحليل واتخاذ قرار' },
    { angle: Math.PI / 2, label: 'تنفيذ', icon: '⚡', color: '#10b981', desc: 'تنفيذ الإجراءات' },
  ];

  const orbitR = 170;
  phases.forEach((phase, i) => {
    const px = Math.cos(phase.angle) * orbitR;
    const py = 10 + Math.sin(phase.angle) * orbitR;

    // Phase circle
    ctx.fillStyle = phase.color;
    ctx.beginPath();
    ctx.arc(px, py, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '22px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(phase.icon, px, py - 4);
    ctx.textBaseline = 'alphabetic';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText(phase.label, px, py + 18);

    // Description
    ctx.fillStyle = COLORS.muted;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText(phase.desc, px, py + 50);

    // Curved arrow between phases
    const nextPhase = phases[(i + 1) % phases.length];
    const nextPx = Math.cos(nextPhase.angle) * orbitR;
    const nextPy = 10 + Math.sin(nextPhase.angle) * orbitR;

    ctx.strokeStyle = phase.color;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = -frame * 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    const cpx = (px + nextPx) / 2;
    const cpy = (py + nextPy) / 2 - 30;
    ctx.quadraticCurveTo(cpx, cpy, nextPx, nextPy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  });

  // Animated orbiting token
  const tokenAngle = frame * 0.03;
  const tokenX = Math.cos(tokenAngle) * orbitR;
  const tokenY = 10 + Math.sin(tokenAngle) * orbitR;
  ctx.fillStyle = '#a78bfa';
  ctx.beginPath();
  ctx.arc(tokenX, tokenY, 6, 0, Math.PI * 2);
  ctx.fill();
  // Trail
  for (let tr = 1; tr <= 5; tr++) {
    const trAngle = tokenAngle - tr * 0.08;
    const trX = Math.cos(trAngle) * orbitR;
    const trY = 10 + Math.sin(trAngle) * orbitR;
    ctx.globalAlpha = 0.4 - tr * 0.07;
    ctx.beginPath();
    ctx.arc(trX, trY, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Tool cards at bottom
  const agentTools = [
    { icon: '🔍', label: 'بحث' },
    { icon: '📊', label: 'تحليل' },
    { icon: '📧', label: 'بريد' },
    { icon: '🗄️', label: 'قاعدة بيانات' },
    { icon: '🔗', label: 'واجهة برمجة' },
  ];

  ctx.fillStyle = COLORS.muted;
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('الأدوات المتاحة', 0, 215);

  agentTools.forEach((tool, i) => {
    const tx = -200 + i * 100;
    const ty = 240;

    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    roundRect(ctx, tx - 35, ty - 15, 70, 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '16px serif';
    ctx.fillStyle = COLORS.text;
    ctx.textAlign = 'center';
    ctx.fillText(tool.icon, tx, ty + 2);

    ctx.font = '9px Inter, sans-serif';
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(tool.label, tx, ty + 16);
  });

  ctx.restore();
}

/* ────────────────────────────────────────────────────────────────
   5. Vibe Coding Animation
   Shows the Describe → Generate → Review → Refine → Iterate loop
   with a prompt morphing into a running application.
   ──────────────────────────────────────────────────────────────── */
function drawVibeCoding(ctx, w, h, frame, t) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w / 900, h / 560);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Title
  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillText('فايب كودينج — من الأمر إلى التطبيق', 0, -240);
  ctx.font = '14px Inter, system-ui, sans-serif';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText('وصف ← توليد ← مراجعة ← تحسين ← تكرار', 0, -215);

  // Steps in a circular flow
  const steps = [
    { angle: -Math.PI / 2, label: 'وصف', icon: '💬', color: '#8b5cf6', desc: 'اكتب فكرتك\nبلغة طبيعية' },
    { angle: -Math.PI / 2 + (2 * Math.PI / 5), label: 'توليد', icon: '🤖', color: '#06b6d4', desc: 'الذكاء الاصطناعي\nيُنشئ الكود' },
    { angle: -Math.PI / 2 + (4 * Math.PI / 5), label: 'مراجعة', icon: '👁️', color: '#10b981', desc: 'تحقق من\nالمخرجات' },
    { angle: -Math.PI / 2 + (6 * Math.PI / 5), label: 'تحسين', icon: '✏️', color: '#f59e0b', desc: 'أضف تعليمات\nمتابعة' },
    { angle: -Math.PI / 2 + (8 * Math.PI / 5), label: 'تكرار', icon: '🔄', color: '#ec4899', desc: 'كرر حتى\nيعمل بشكل صحيح' },
  ];

  const circleR = 150;
  const stepSize = 38;

  // Draw connecting curve
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 20, circleR, 0, Math.PI * 2);
  ctx.stroke();

  // Animated flow ring
  ctx.strokeStyle = '#a78bfa';
  ctx.lineWidth = 3;
  ctx.setLineDash([15, 25]);
  ctx.lineDashOffset = -frame * 3;
  ctx.beginPath();
  ctx.arc(0, 20, circleR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  steps.forEach((step, i) => {
    const sx = Math.cos(step.angle) * circleR;
    const sy = 20 + Math.sin(step.angle) * circleR;

    // Active step highlight
    const activeStep = Math.floor((frame % 250) / 50);
    const isActive = activeStep === i;

    if (isActive) {
      ctx.shadowColor = step.color;
      ctx.shadowBlur = 20;
    }

    // Step circle
    ctx.fillStyle = isActive ? step.color : '#fff';
    ctx.strokeStyle = step.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sx, sy, stepSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Icon
    ctx.font = '24px serif';
    ctx.fillStyle = isActive ? '#fff' : step.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(step.icon, sx, sy - 4);
    ctx.textBaseline = 'alphabetic';

    // Label
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = isActive ? '#fff' : COLORS.text;
    ctx.fillText(step.label, sx, sy + 20);

    // Description outside
    const descR = circleR + 68;
    const dx = Math.cos(step.angle) * descR;
    const dy = 20 + Math.sin(step.angle) * descR;
    ctx.fillStyle = COLORS.muted;
    ctx.font = '10px Inter, sans-serif';
    const descLines = step.desc.split('\n');
    descLines.forEach((line, li) => {
      ctx.fillText(line, dx, dy + li * 13);
    });

    // Step number
    ctx.fillStyle = step.color;
    ctx.font = 'bold 9px Inter, sans-serif';
    const numR = circleR - 25;
    const nx = Math.cos(step.angle) * numR;
    const ny = 20 + Math.sin(step.angle) * numR;
    ctx.fillText(`${i + 1}`, nx, ny + 4);
  });

  // Center content: mini app mockup
  const appPhase = (frame % 300) / 300;
  if (appPhase < 0.2) {
    // Prompt text
    ctx.fillStyle = '#f5f3ff';
    roundRect(ctx, -70, 0, 140, 40, 8);
    ctx.fill();
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1;
    roundRect(ctx, -70, 0, 140, 40, 8);
    ctx.stroke();

    // Typing cursor animation
    const cursorVisible = Math.floor(frame / 15) % 2 === 0;
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    const typedLen = Math.min(Math.floor(appPhase * 5 * 14), 14);
    const promptText = 'أنشئ تطبيقاً...';
    ctx.fillText(promptText.slice(0, typedLen), -60, 24);
    if (cursorVisible) {
      const textW = ctx.measureText(promptText.slice(0, typedLen)).width;
      ctx.fillRect(-60 + textW, 14, 2, 14);
    }
  } else if (appPhase < 0.5) {
    // Loading / generating
    const loadAngle = frame * 0.1;
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 20, 20, loadAngle, loadAngle + Math.PI * 1.5);
    ctx.stroke();
    ctx.fillStyle = '#06b6d4';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('جارٍ التوليد...', 0, 50);
  } else {
    // Mini app preview
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    roundRect(ctx, -55, -5, 110, 55, 6);
    ctx.fill();
    ctx.stroke();

    // Title bar
    ctx.fillStyle = '#f1f5f9';
    roundRectTop(ctx, -55, -5, 110, 14, 6);
    ctx.fill();
    // Dots
    [[-45, 2], [-39, 2], [-33, 2]].forEach(([dx, dy]) => {
      ctx.fillStyle = ['#ef4444', '#f59e0b', '#10b981'][[[-45, 2], [-39, 2], [-33, 2]].indexOf([dx, dy]) === -1 ? 0 : [[-45, 2], [-39, 2], [-33, 2]].findIndex(p => p[0] === dx)];
      ctx.beginPath();
      ctx.arc(dx, dy, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Mini content lines
    ctx.fillStyle = '#e2e8f0';
    for (let l = 0; l < 3; l++) {
      roundRect(ctx, -45, 14 + l * 10, 60 + (l === 1 ? -15 : 0), 5, 2);
      ctx.fill();
    }

    // Check mark
    ctx.fillStyle = '#10b981';
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓', 35, 35);
  }

  ctx.restore();
}

/* ────────────────────────────────────────────────────────────────
   6. Comparison: Traditional vs AI Automation (side-by-side)
   ──────────────────────────────────────────────────────────────── */
function drawComparison(ctx, w, h, frame, t) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w / 900, h / 560);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Title
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillText('الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي', 0, -245);

  // Divider
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(0, -220);
  ctx.lineTo(0, 250);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.arc(0, -220, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.muted;
  ctx.font = '14px serif';
  ctx.fillText('⚔️', 0, -216);

  // LEFT: Traditional
  ctx.fillStyle = COLORS.trad;
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('تقليدية', -220, -195);

  // Simple conveyor mini
  const leftItems = [
    { y: -140, label: 'قواعد إذا / إذن', icon: '⚙️' },
    { y: -70,  label: 'بيانات مهيكلة فقط', icon: '📊' },
    { y: 0,    label: 'معالجة خطية', icon: '➡️' },
    { y: 70,   label: 'لا تتعامل مع الاستثناءات', icon: '🚫' },
    { y: 140,  label: 'مخرجات ثابتة', icon: '📋' },
  ];

  leftItems.forEach((item, i) => {
    const ix = -220;
    const phaseOffset = ((frame * 1.2 + i * 30) % 60) / 60;
    const bounce = Math.sin(phaseOffset * Math.PI) * 3;

    ctx.fillStyle = '#eef2ff';
    ctx.strokeStyle = COLORS.trad;
    ctx.lineWidth = 1.5;
    roundRect(ctx, ix - 90, item.y - 18 + bounce, 180, 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '16px serif';
    ctx.fillStyle = COLORS.trad;
    ctx.textAlign = 'center';
    ctx.fillText(item.icon, ix - 60, item.y + 6 + bounce);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = COLORS.text;
    ctx.fillText(item.label, ix + 20, item.y + 5 + bounce);
  });

  // RIGHT: AI
  ctx.fillStyle = COLORS.ai;
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ذكاء اصطناعي', 220, -195);

  const rightItems = [
    { y: -140, label: 'منطق مدرك للسياق', icon: '🧠' },
    { y: -70,  label: 'أي نوع بيانات', icon: '📷' },
    { y: 0,    label: 'معالجة تكيفية', icon: '🔄' },
    { y: 70,   label: 'تتعامل مع الاستثناءات', icon: '✅' },
    { y: 140,  label: 'مخرجات ذكية', icon: '🎯' },
  ];

  rightItems.forEach((item, i) => {
    const ix = 220;
    const phaseOffset = ((frame * 1.5 + i * 25) % 60) / 60;
    const bounce = Math.sin(phaseOffset * Math.PI) * 3;

    // Gradient background
    ctx.fillStyle = '#ecfeff';
    ctx.strokeStyle = COLORS.ai;
    ctx.lineWidth = 1.5;
    roundRect(ctx, ix - 90, item.y - 18 + bounce, 180, 36, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '16px serif';
    ctx.fillStyle = COLORS.ai;
    ctx.textAlign = 'center';
    ctx.fillText(item.icon, ix - 60, item.y + 6 + bounce);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = COLORS.text;
    ctx.fillText(item.label, ix + 20, item.y + 5 + bounce);
  });

  // Bottom summary
  ctx.fillStyle = '#f0fdf4';
  roundRect(ctx, -380, 200, 760, 44, 10);
  ctx.fill();
  ctx.strokeStyle = COLORS.success;
  ctx.lineWidth = 1;
  roundRect(ctx, -380, 200, 760, 44, 10);
  ctx.stroke();

  ctx.fillStyle = COLORS.success;
  ctx.font = '13px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('أتمتة الذكاء الاصطناعي تبني على الأتمتة التقليدية — بإضافة الذكاء والتكيف والوعي بالسياق', 0, 226);

  ctx.restore();
}

/* ── Canvas utility: rounded rectangle ── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function roundRectTop(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function bezierPoint(x0, y0, cx1, cy1, cx2, cy2, x3, y3, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * x0 + 3 * mt * mt * t * cx1 + 3 * mt * t * t * cx2 + t * t * t * x3,
    y: mt * mt * mt * y0 + 3 * mt * mt * t * cy1 + 3 * mt * t * t * cy2 + t * t * t * y3,
  };
}

/* ── Animation registry ── */
const ANIMATIONS = {
  'traditional-automation': {
    draw: drawTraditionalAutomation,
    title: 'Traditional Automation',
    titleAr: 'الأتمتة التقليدية',
    description: 'See how rule-based automation works: fixed rules, structured data, linear processing.',
    descriptionAr: 'شاهد كيف تعمل الأتمتة القائمة على القواعد: قواعد ثابتة، بيانات منظمة، معالجة خطية.',
  },
  'ai-automation': {
    draw: drawAIAutomation,
    title: 'AI-Powered Automation',
    titleAr: 'الأتمتة بالذكاء الاصطناعي',
    description: 'Watch how AI automation handles any data type with adaptive, intelligent processing.',
    descriptionAr: 'شاهد كيف تتعامل أتمتة الذكاء الاصطناعي مع أي نوع من البيانات بمعالجة ذكية وتكيفية.',
  },
  'trad-vs-ai': {
    draw: drawComparison,
    title: 'Traditional vs AI Automation',
    titleAr: 'الأتمتة التقليدية مقابل أتمتة الذكاء الاصطناعي',
    description: 'Compare traditional rule-based automation with intelligent AI-powered automation side by side.',
    descriptionAr: 'قارن بين الأتمتة التقليدية القائمة على القواعد وأتمتة الذكاء الاصطناعي الذكية جنبًا إلى جنب.',
  },
  'workflow-building-blocks': {
    draw: drawWorkflow,
    title: 'Workflow Building Blocks',
    titleAr: 'مكونات سير العمل',
    description: 'Visualize how triggers, actions, conditions, and outputs connect in a workflow.',
    descriptionAr: 'تصور كيف تتصل المحفزات والإجراءات والشروط والمخرجات في سير العمل.',
  },
  'ai-agent-loop': {
    draw: drawAIAgent,
    title: 'AI Agent — Perceive, Reason, Act',
    titleAr: 'وكيل الذكاء الاصطناعي — الإدراك والتفكير والتنفيذ',
    description: 'See how AI agents operate: perceiving their environment, reasoning about goals, and taking actions.',
    descriptionAr: 'شاهد كيف تعمل وكلاء الذكاء الاصطناعي: إدراك بيئتهم، التفكير في الأهداف، واتخاذ الإجراءات.',
  },
  'vibe-coding-flow': {
    draw: drawVibeCoding,
    title: 'Vibe Coding — Prompt to App',
    titleAr: 'فايب كودينج — من الأمر إلى التطبيق',
    description: 'Watch the vibe coding loop: describe your idea, AI generates code, review, refine, and iterate.',
    descriptionAr: 'شاهد دورة فايب كودينج: صِف فكرتك، يُنشئ الذكاء الاصطناعي الكود، راجع، حسِّن، وكرِّر.',
  },
};

export { ANIMATIONS };

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function AnimatedSlide({ animationId }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(0);
  const rafRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const { lang } = useLanguage();

  const animData = ANIMATIONS[animationId];
  if (!animData) return null;

  const title = lang === 'ar' ? animData.titleAr : animData.title;
  const description = lang === 'ar' ? animData.descriptionAr : animData.description;

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.max(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const drawFrame = (timestamp) => {
      if (!canvasRef.current) return;
      frameRef.current += 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      animData.draw(ctx, w, h, frameRef.current, timestamp);
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    rafRef.current = requestAnimationFrame(drawFrame);

    return () => {
      resizeObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animData]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const cleanup = startAnimation();
    return cleanup;
  }, [playing, startAnimation]);

  const handleReset = () => {
    frameRef.current = 0;
    if (!playing) {
      setPlaying(true);
    }
  };

  const togglePlay = () => {
    setPlaying(p => !p);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="w-full text-center mb-3">
        <h3 className="font-display font-bold text-lg text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="w-full bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        style={{ aspectRatio: '16/10', minHeight: '300px' }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing ? (lang === 'ar' ? 'إيقاف' : 'Pause') : (lang === 'ar' ? 'تشغيل' : 'Play')}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {lang === 'ar' ? 'إعادة' : 'Restart'}
        </button>
        <span className="text-[10px] text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded-full">
          {lang === 'ar' ? 'رسوم متحركة تفاعلية' : 'Interactive Animation'}
        </span>
      </div>
    </div>
  );
}
