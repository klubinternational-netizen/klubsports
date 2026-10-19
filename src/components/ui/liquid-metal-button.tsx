'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface LiquidMetalButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'chrome' | 'orange';
  showArrow?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function LiquidMetalButton({
  label = 'Explore Products',
  href,
  onClick,
  variant = 'chrome',
  showArrow = true,
  className = '',
  size = 'md',
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const rippleId = useRef(0);

  // Dynamic width based on label length to prevent truncation
  const dimensions = useMemo(() => {
    const textLength = label.length;
    const isSm = size === 'sm';
    const computedWidth = isSm
      ? Math.max(122, Math.round(textLength * 7) + (showArrow ? 38 : 24))
      : Math.max(180, Math.round(textLength * 8.5) + (showArrow ? 52 : 36));
    const height = isSm ? 38 : 48;
    return {
      width: computedWidth,
      height,
      innerWidth: computedWidth - 4,
      innerHeight: height - 4,
      shaderWidth: computedWidth,
      shaderHeight: height,
    };
  }, [label, showArrow, size]);

  useEffect(() => {
    const styleId = 'shader-canvas-style-exploded';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 9999px !important;
        }
        @keyframes liquid-ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    let isMounted = true;

    const loadShader = async () => {
      try {
        const { liquidMetalFragmentShader, ShaderMount } = await import('@paper-design/shaders');

        if (!isMounted || !shaderRef.current) return;

        if (shaderMount.current?.destroy) {
          shaderMount.current.destroy();
        }

        // Shaders parameters
        const shaderConfig =
          variant === 'orange'
            ? {
                u_repetition: 4,
                u_softness: 0.6,
                u_shiftRed: 0.6,
                u_shiftBlue: 0.1,
                u_distortion: 0.1,
                u_contour: 0,
                u_angle: 45,
                u_scale: 7,
                u_shape: 1,
                u_offsetX: 0.1,
                u_offsetY: -0.1,
              }
            : {
                u_repetition: 4,
                u_softness: 0.5,
                u_shiftRed: 0.3,
                u_shiftBlue: 0.3,
                u_distortion: 0,
                u_contour: 0,
                u_angle: 45,
                u_scale: 8,
                u_shape: 1,
                u_offsetX: 0.1,
                u_offsetY: -0.1,
              };

        shaderMount.current = new ShaderMount(
          shaderRef.current,
          liquidMetalFragmentShader,
          shaderConfig,
          undefined,
          0.6
        );
      } catch (error) {
        console.error('[ShaderButton] Failed to load liquid metal shader:', error);
      }
    };

    loadShader();

    return () => {
      isMounted = false;
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, [dimensions.width, dimensions.height, variant]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1.2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        if (isHovered) {
          shaderMount.current?.setSpeed?.(1.2);
        } else {
          shaderMount.current?.setSpeed?.(0.6);
        }
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  const content = (
    <div
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transformStyle: 'preserve-3d',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.02)' : 'none',
        }}
      >
        {/* Layer 1: Label and Icon */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(20px)',
            zIndex: 30,
            pointerEvents: 'none',
            padding: '0 16px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: '#ffffff',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              textShadow: '0px 1px 3px rgba(0, 0, 0, 0.8)',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
          {showArrow && (
            <ArrowRight
              size={14}
              style={{
                color: variant === 'orange' ? '#ffffff' : '#ee7700',
                filter: 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.8))',
                transition: 'transform 0.2s ease',
                transform: isHovered ? 'translateX(2px)' : 'none',
              }}
            />
          )}
        </div>

        {/* Layer 2: Inner Core Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformStyle: 'preserve-3d',
            transform: `translateZ(10px) ${isPressed ? 'translateY(1px)' : 'translateY(0)'}`,
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: `${dimensions.innerWidth}px`,
              height: `${dimensions.innerHeight}px`,
              margin: '2px',
              borderRadius: '9999px',
              background:
                variant === 'orange'
                  ? 'linear-gradient(180deg, #ee7700 0%, #aa4e00 100%)'
                  : 'linear-gradient(180deg, #1f1f23 0%, #0a0a0c 100%)',
              boxShadow: isPressed
                ? 'inset 0px 2px 4px rgba(0, 0, 0, 0.6)'
                : 'inset 0px 1px 1px rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
            }}
          />
        </div>

        {/* Layer 3: Shader Canvas Outer Ring */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(0px)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: `${dimensions.height}px`,
              width: `${dimensions.width}px`,
              borderRadius: '9999px',
              boxShadow: isHovered
                ? '0px 0px 20px 2px rgba(238, 119, 0, 0.35), 0px 8px 16px -4px rgba(0, 0, 0, 0.5)'
                : '0px 0px 0px 1px rgba(255, 255, 255, 0.15), 0px 4px 10px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              background: 'transparent',
            }}
          >
            <div
              ref={shaderRef}
              className="shader-container-exploded"
              style={{
                borderRadius: '9999px',
                overflow: 'hidden',
                position: 'relative',
                width: `${dimensions.shaderWidth}px`,
                maxWidth: `${dimensions.shaderWidth}px`,
                height: `${dimensions.shaderHeight}px`,
              }}
            />
          </div>
        </div>

        {/* Ripples container */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={{
              position: 'absolute',
              left: `${ripple.x}px`,
              top: `${ripple.y}px`,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%)',
              pointerEvents: 'none',
              animation: 'liquid-ripple-animation 0.6s ease-out',
              zIndex: 35,
            }}
          />
        ))}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={buttonRef as any}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className={`relative inline-block cursor-pointer select-none focus:outline-none ${className}`}
        aria-label={label}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as any}
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`relative inline-block cursor-pointer select-none border-none bg-transparent p-0 focus:outline-none ${className}`}
      aria-label={label}
    >
      {content}
    </button>
  );
}
