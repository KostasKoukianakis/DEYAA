import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Counter animation hook
function useCounterAnimation(targetValue: number, duration: number = 2000) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const animationRef = useRef<number | null>(null);
  const startValueRef = useRef(targetValue);
  const previousTargetRef = useRef(targetValue);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // On initial mount, set value immediately without animation
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setDisplayValue(targetValue);
      startValueRef.current = targetValue;
      previousTargetRef.current = targetValue;
      return;
    }

    // Only animate if target value changed
    if (previousTargetRef.current === targetValue) {
      return;
    }

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startValueRef.current = displayValue;
    previousTargetRef.current = targetValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(
        startValueRef.current + (targetValue - startValueRef.current) * easeOut
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
        startValueRef.current = targetValue;
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}

interface DataPoint {
  label: string;
  value: number;
  unit: string;
  trend?: "up" | "down" | "stable";
  color?: string;
}

interface DataVisualizationProps {
  className?: string;
}

export function DataVisualization({ className }: DataVisualizationProps) {
  const [reservoirLevel, setReservoirLevel] = useState(78);
  const [waterQuality, setWaterQuality] = useState(98);
  const [dailyConsumption, setDailyConsumption] = useState(1250);

  // Animated counters
  const animatedReservoir = useCounterAnimation(reservoirLevel);
  const animatedQuality = useCounterAnimation(waterQuality);
  const animatedConsumption = useCounterAnimation(dailyConsumption);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // Reservoir level: 75-85%
      setReservoirLevel(75 + Math.random() * 10);
      
      // Water quality: 96-100%
      setWaterQuality(96 + Math.random() * 4);
      
      // Daily consumption: 1200-1300 m³
      setDailyConsumption(1200 + Math.random() * 100);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const dataPoints: DataPoint[] = [
    {
      label: "Στάθμη Δεξαμενών",
      value: animatedReservoir,
      unit: "%",
      trend: reservoirLevel > 80 ? "up" : "stable",
      color: "text-accent",
    },
    {
      label: "Ποιότητα Νερού",
      value: animatedQuality,
      unit: "%",
      trend: "stable",
      color: "text-green-600",
    },
    {
      label: "Ημερήσια Κατανάλωση",
      value: animatedConsumption,
      unit: " m³",
      trend: "stable",
      color: "text-primary",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {dataPoints.map((point, index) => (
        <Card key={point.label} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {point.label}
              </CardTitle>
              {index === 0 && <Droplets className="h-4 w-4 text-accent" />}
              {index === 1 && <Activity className="h-4 w-4 text-green-600" />}
              {index === 2 && <TrendingUp className="h-4 w-4 text-primary" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className={cn("text-3xl font-bold", point.color)}>
                  {point.value}
                </span>
                <span className="text-sm text-muted-foreground">{point.unit}</span>
              </div>
              
              {/* Animated progress bar */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    index === 0 && "bg-gradient-to-r from-accent to-primary",
                    index === 1 && "bg-gradient-to-r from-green-500 to-green-600",
                    index === 2 && "bg-gradient-to-r from-primary to-accent"
                  )}
                  style={{ width: `${point.value}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                </div>
              </div>
              
              {/* Trend indicator */}
              {point.trend && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {point.trend === "up" && (
                    <>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span>Αύξηση</span>
                    </>
                  )}
                  {point.trend === "down" && (
                    <>
                      <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                      <span>Μείωση</span>
                    </>
                  )}
                  {point.trend === "stable" && (
                    <>
                      <Activity className="h-3 w-3 text-blue-600" />
                      <span>Σταθερή</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
