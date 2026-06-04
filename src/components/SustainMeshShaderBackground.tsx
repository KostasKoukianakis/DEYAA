import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_animate;

  varying vec2 v_uv;

  vec2 coverUV(vec2 uv, vec2 resolution) {
    float viewAspect = resolution.x / resolution.y;
    float targetAspect = 16.0 / 9.0;
    vec2 scale = vec2(1.0);
    if (viewAspect > targetAspect) {
      scale.y = targetAspect / viewAspect;
    } else {
      scale.x = viewAspect / targetAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  float blob(vec2 uv, vec2 center, vec2 radius) {
    vec2 d = (uv - center) / radius;
    return exp(-dot(d, d));
  }

  float blobRot(vec2 uv, vec2 center, vec2 radius, float angle) {
    vec2 p = uv - center;
    float c = cos(angle);
    float s = sin(angle);
    p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    vec2 d = p / radius;
    return exp(-dot(d, d));
  }

  void main() {
    vec2 uv = coverUV(v_uv, u_resolution);
    float t = u_time * u_animate;

    vec2 c1 = vec2(0.26 + sin(t * 0.11) * 0.018, 0.58 + cos(t * 0.09) * 0.012);
    vec2 c2 = vec2(0.46 + cos(t * 0.08) * 0.012, 0.50 + sin(t * 0.10) * 0.014);
    vec2 c3 = vec2(0.72 + sin(t * 0.07) * 0.015, 0.54 + cos(t * 0.12) * 0.010);

    float b1 = blob(uv, c1, vec2(0.34, 0.28));
    float b2 = blobRot(uv, c2, vec2(0.12, 0.36), 0.32);
    float b3 = blob(uv, c3, vec2(0.22, 0.24));

    vec3 white = vec3(1.0);
    vec3 blueSoft = vec3(0.22, 0.72, 1.0);
    vec3 greenSoft = vec3(0.52, 0.90, 0.08);
    vec3 cyanSoft = vec3(0.0, 0.72, 0.92);

    vec3 color = white;
    color = mix(color, blueSoft, b1 * 0.94);
    color = mix(color, greenSoft, b2 * 0.86);
    color = mix(color, cyanSoft, b3 * 0.92);

    float vignette = smoothstep(1.05, 0.15, distance(uv, vec2(0.5, 0.52)));
    color = mix(color, white, vignette * 0.16);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("SustainMeshShader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("SustainMeshShader link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

interface SustainMeshShaderBackgroundProps {
  className?: string;
  /** Slow ambient drift of color blobs */
  animate?: boolean;
}

/**
 * Soft mesh-gradient background — white base with blue / lime / cyan blobs.
 * WebGL shader with CSS fallback for reduced motion or unsupported GPUs.
 */
export function SustainMeshShaderBackground({
  className,
  animate = true,
}: SustainMeshShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = animate && !reducedMotion;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });

    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "a_position");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uAnimate = gl.getUniformLocation(program, "u_animate");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas;
      if (clientWidth === 0 || clientHeight === 0) return;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const render = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) * 0.001;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uAnimate, shouldAnimate ? 1 : 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (shouldAnimate) {
        frameRef.current = requestAnimationFrame(render);
      }
    };

    render(performance.now());
    if (!shouldAnimate) {
      const onResize = () => render(performance.now());
      window.addEventListener("resize", onResize);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", onResize);
        gl.deleteProgram(program);
        gl.deleteBuffer(buffer);
      };
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameRef.current);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [animate]);

  return (
    <div className={cn("sustain-mesh-shader", className)} aria-hidden>
      <div className="sustain-mesh-shader__fallback" />
      <canvas ref={canvasRef} className="sustain-mesh-shader__canvas" />
    </div>
  );
}
