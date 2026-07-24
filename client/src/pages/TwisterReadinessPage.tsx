/* SPEC VERIFICATION REQUIRED BEFORE MERGE: all Twister performance figures on this
   page (weight, radius, endurance, deploy time, payload, link, DronePort capacity)
   are from public Quantum Systems materials — Andy to verify against the current
   official spec sheet before this ships. */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle,
  Clock,
  Cpu,
  Lock,
  Moon,
  Plane,
  Radar,
  Timer,
} from "lucide-react";

type QuestionId =
  | "orgType"
  | "mission"
  | "responseTime"
  | "assets"
  | "nightOps"
  | "radius"
  | "deployment"
  | "timeline";

interface QuizOption {
  value: string;
  label: string;
}

interface QuizQuestion {
  id: QuestionId;
  prompt: string;
  helper?: string;
  options: QuizOption[];
}

type Answers = Partial<Record<QuestionId, string>>;

const QUESTIONS: QuizQuestion[] = [
  {
    id: "orgType",
    prompt: "Which best describes your organization?",
    options: [
      { value: "law-enforcement", label: "Law enforcement" },
      { value: "fire", label: "Fire / emergency services" },
      { value: "sar", label: "Search & rescue" },
      { value: "infrastructure", label: "Port / critical-infrastructure security" },
      { value: "government", label: "Other government agency" },
      { value: "commercial", label: "Private / commercial" },
    ],
  },
  {
    id: "mission",
    prompt: "What's your primary aerial mission set?",
    options: [
      { value: "overwatch", label: "Incident & scene overwatch" },
      { value: "sar", label: "Search & rescue" },
      { value: "wildfire", label: "Wildfire / disaster response" },
      { value: "perimeter", label: "Perimeter & infrastructure security" },
      { value: "multi", label: "Multi-mission (several of the above)" },
    ],
  },
  {
    id: "responseTime",
    prompt: "When a call comes in, how fast do you need eyes overhead?",
    options: [
      { value: "under15", label: "Under 15 minutes" },
      { value: "15to60", label: "15–60 minutes" },
      { value: "sameday", label: "Same day" },
      { value: "planned", label: "Pre-planned missions only" },
    ],
  },
  {
    id: "assets",
    prompt: "What aerial assets do you operate today?",
    options: [
      { value: "none", label: "None yet" },
      { value: "manned", label: "Manned aviation only" },
      { value: "multirotor", label: "Small multirotor drones" },
      { value: "fixedwing", label: "Fixed-wing or hybrid VTOL UAS" },
      { value: "mixed", label: "Mixed fleet (multirotor + fixed-wing)" },
    ],
  },
  {
    id: "nightOps",
    prompt: "Can you fly night / thermal missions today?",
    options: [
      { value: "routine", label: "Yes, routinely" },
      { value: "limited", label: "Limited (some thermal, rarely at night)" },
      { value: "no", label: "No night capability" },
    ],
  },
  {
    id: "radius",
    prompt: "How far from the launch point do missions typically need to reach?",
    options: [
      { value: "under1", label: "Under 1 km (scene overwatch)" },
      { value: "1to5", label: "1–5 km" },
      { value: "5to15", label: "5–15 km" },
      { value: "over15", label: "Beyond 15 km" },
    ],
  },
  {
    id: "deployment",
    prompt: "Who gets aircraft in the air in the field?",
    options: [
      { value: "none", label: "No field deployment capability today" },
      { value: "dedicated", label: "Dedicated centralized flight team" },
      { value: "collateral", label: "Trained collateral-duty operators" },
      { value: "vehicle", label: "Single operator launching from a response vehicle" },
    ],
  },
  {
    id: "timeline",
    prompt: "Where are you in the procurement process?",
    helper: "Not scored — this just helps us tailor your Mission Fit Report.",
    options: [
      { value: "active", label: "Actively evaluating (0–6 months)" },
      { value: "budgeting", label: "Budgeting for next fiscal year" },
      { value: "researching", label: "Researching (12+ months)" },
      { value: "exploring", label: "Just exploring" },
    ],
  },
];

type Tier = "Developing ISR Capability" | "Operational, With Gaps" | "Mission Ready";

interface Gap {
  id: string;
  title: string;
  description: string;
}

interface ReadinessResult {
  score: number;
  tier: Tier;
  gaps: Gap[];
}

const GAP_DEFS: Record<string, Omit<Gap, "id">> = {
  "no-aerial": {
    title: "No aerial capability",
    description:
      "You're starting from zero — which means no legacy constraints. The Twister is a complete starting point: VTOL launch, winged flight, and an approx. 2-minute deploy by a single operator.",
  },
  "response-time": {
    title: "Response time",
    description:
      "Your response-time requirement outpaces your deployment model. The Twister deploys in approx. 2 minutes by a single operator from a response vehicle — no catapult, no launch crew.",
  },
  "night-ops": {
    title: "Night operations",
    description:
      "Night and thermal coverage is where missions are lost. The Twister's Nighthawk2 EO/IR gimbal flies day and thermal channels and swaps in the field.",
  },
  "coverage-radius": {
    title: "Coverage radius",
    description:
      "Your reach requirement exceeds what small multirotors deliver. The Twister covers up to 15 km from the launch point with up to 90 minutes of winged endurance.",
  },
  persistence: {
    title: "Persistent stare",
    description:
      "Overwatch and perimeter missions need time on station. The Twister's winged flight profile holds a parking orbit with up to 90 minutes of endurance.",
  },
};

const ASSET_POINTS: Record<string, number> = {
  none: 0,
  manned: 8,
  multirotor: 14,
  fixedwing: 22,
  mixed: 25,
};

const NIGHT_POINTS: Record<string, number> = { no: 0, limited: 12, routine: 25 };

const DEPLOY_POINTS: Record<string, number> = {
  none: 0,
  dedicated: 15,
  collateral: 20,
  vehicle: 25,
};

export function computeReadiness(answers: Answers): ReadinessResult {
  const pillarA = ASSET_POINTS[answers.assets ?? ""] ?? 0;
  const pillarB = NIGHT_POINTS[answers.nightOps ?? ""] ?? 0;
  const pillarC = DEPLOY_POINTS[answers.deployment ?? ""] ?? 0;

  let pillarD = 25;
  if (answers.responseTime === "under15" && answers.deployment === "none") pillarD -= 12;
  else if (answers.responseTime === "under15" && answers.deployment === "dedicated")
    pillarD -= 8;
  else if (answers.responseTime === "15to60" && answers.deployment === "none") pillarD -= 8;

  const limitedFleet = answers.assets === "none" || answers.assets === "multirotor";
  if ((answers.radius === "5to15" || answers.radius === "over15") && limitedFleet)
    pillarD -= 12;
  else if (answers.radius === "1to5" && answers.assets === "none") pillarD -= 6;

  if (
    (answers.mission === "sar" || answers.mission === "wildfire") &&
    answers.nightOps === "no"
  )
    pillarD -= 6;

  pillarD = Math.max(0, pillarD);

  const score = Math.min(100, Math.max(0, pillarA + pillarB + pillarC + pillarD));
  const tier: Tier =
    score < 40
      ? "Developing ISR Capability"
      : score < 70
        ? "Operational, With Gaps"
        : "Mission Ready";

  const gaps: Gap[] = [];
  const addGap = (id: string) => {
    if (gaps.length < 2 && GAP_DEFS[id]) gaps.push({ id, ...GAP_DEFS[id] });
  };
  const slowDeploy = answers.deployment === "none" || answers.deployment === "dedicated";
  const fastNeed = answers.responseTime === "under15" || answers.responseTime === "15to60";

  if (answers.assets === "none") addGap("no-aerial");
  if (fastNeed && slowDeploy) addGap("response-time");
  if (answers.nightOps === "no" || answers.nightOps === "limited") addGap("night-ops");
  if ((answers.radius === "5to15" || answers.radius === "over15") && limitedFleet)
    addGap("coverage-radius");
  if ((answers.mission === "overwatch" || answers.mission === "perimeter") && limitedFleet)
    addGap("persistence");

  return { score, tier, gaps };
}

export function buildLeadMessage(answers: Answers, result: ReadinessResult): string {
  const answerLines = QUESTIONS.map((q) => {
    const label =
      q.options.find((o) => o.value === answers[q.id])?.label ?? "(not answered)";
    const fieldNames: Record<QuestionId, string> = {
      orgType: "Org type",
      mission: "Primary mission",
      responseTime: "Response-time req",
      assets: "Current assets",
      nightOps: "Night/thermal",
      radius: "Coverage need",
      deployment: "Deployment model",
      timeline: "Timeline",
    };
    return `${fieldNames[q.id]}: ${label}`;
  });

  const gapsLine =
    result.gaps.length > 0
      ? `Gaps identified: ${result.gaps.map((g) => g.title).join("; ")}`
      : "Gaps identified: none — strong baseline";

  return [
    `ISR Readiness Assessment — Score ${result.score}/100 (${result.tier})`,
    "",
    ...answerLines,
    "",
    gapsLine,
    "Requested: Mission Fit Report by email + West Coast live-demo list",
  ].join("\n");
}

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Agency or company name must be at least 2 characters"),
  phone: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

type Phase = "intro" | "quiz" | "reveal" | "submitted";

const stepVariants = {
  enter: (d: number) => ({ opacity: 0, x: 24 * d }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: -24 * d }),
};

interface QuizStepCardProps {
  stepIndex: number;
  direction: 1 | -1;
  answers: Answers;
  onSelect: (id: QuestionId, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

function QuizStepCard({
  stepIndex,
  direction,
  answers,
  onSelect,
  onBack,
  onNext,
}: QuizStepCardProps) {
  const reduceMotion = useReducedMotion();
  const question = QUESTIONS[stepIndex];
  const selected = answers[question.id];
  const progressValue = Math.round(((stepIndex + 1) / QUESTIONS.length) * 100);

  return (
    <Card className="max-w-2xl mx-auto" data-testid="card-quiz-step">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
          <span data-testid="text-step-count">
            Step {stepIndex + 1} of {QUESTIONS.length}
          </span>
          <span>{progressValue}%</span>
        </div>
        <Progress value={progressValue} className="mb-8" data-testid="progress-quiz" />

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
          >
            <h3
              className="text-2xl lg:text-3xl font-bold text-foreground mb-2"
              data-testid="text-question-prompt"
            >
              {question.prompt}
            </h3>
            {question.helper && (
              <p className="text-sm text-muted-foreground mb-4">{question.helper}</p>
            )}
            <RadioGroup
              value={selected ?? ""}
              onValueChange={(value) => onSelect(question.id, value)}
              className="mt-6 space-y-3"
            >
              {question.options.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`${question.id}-${option.value}`}
                  className={`flex items-center gap-3 rounded-md border p-4 min-h-12 cursor-pointer hover-elevate ${
                    selected === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  data-testid={`radio-option-${option.value}`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`${question.id}-${option.value}`}
                  />
                  <span className="text-base font-normal">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onBack} data-testid="button-quiz-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            size="lg"
            onClick={onNext}
            disabled={!selected}
            data-testid="button-quiz-next"
          >
            {stepIndex === QUESTIONS.length - 1 ? "Get My Score" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const reduceMotion = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const RADIUS = 70;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset = useTransform(mv, (v) => CIRCUMFERENCE * (1 - v / 100));

  useEffect(() => {
    if (reduceMotion) {
      mv.set(score);
      return;
    }
    const controls = animate(mv, score, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [score, reduceMotion, mv]);

  return (
    <div className="relative h-40 w-40 mx-auto" data-testid="gauge-score">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          className="stroke-muted"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={{ strokeDashoffset: dashOffset }}
          className="stroke-primary"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-5xl font-bold text-foreground"
          data-testid="text-score-value"
        >
          {rounded}
        </motion.span>
      </div>
    </div>
  );
}

interface LeadCaptureFormProps {
  answers: Answers;
  result: ReadinessResult;
  onSuccess: () => void;
}

function LeadCaptureForm({ answers, result, onSuccess }: LeadCaptureFormProps) {
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", company: "", phone: "" },
  });

  const leadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      return await apiRequest("POST", "/api/contact", {
        ...data,
        subject: `Twister Readiness — ${data.company} (score ${result.score})`,
        message: buildLeadMessage(answers, result),
        inquiryType: "twister-readiness",
      });
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description:
          "Your Mission Fit Report is on the way — and you're on the West Coast demo priority list.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send your results. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    if (leadMutation.isPending) return;
    leadMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Jordan Rivers" {...field} data-testid="input-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@youragency.gov"
                  {...field}
                  data-testid="input-email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agency / company *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your agency or company"
                  {...field}
                  data-testid="input-company"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...field}
                  data-testid="input-phone"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="xl"
          className="w-full"
          disabled={leadMutation.isPending}
          data-testid="button-submit-lead"
        >
          {leadMutation.isPending
            ? "Sending..."
            : "Send My Mission Fit Report"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Your answers are used only to prepare your report — never shared or sold.
        </p>
      </form>
    </Form>
  );
}

interface ScoreRevealProps {
  answers: Answers;
  result: ReadinessResult;
  onEditAnswers: () => void;
  onSuccess: () => void;
}

function ScoreReveal({ answers, result, onEditAnswers, onSuccess }: ScoreRevealProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card data-testid="card-score-reveal">
        <CardContent className="p-6 sm:p-8 text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your ISR Readiness Score
          </p>
          <ScoreGauge score={result.score} />
          <Badge variant="secondary" className="text-base px-4 py-1" data-testid="badge-tier">
            {result.tier}
          </Badge>

          {result.gaps.length > 0 ? (
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-semibold text-foreground text-center">
                Where your score was lost
              </h3>
              {result.gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="rounded-md border border-primary/20 bg-primary/5 p-4"
                  data-testid={`card-gap-${gap.id}`}
                >
                  <p className="font-semibold text-foreground">{gap.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{gap.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-md border border-primary/20 bg-primary/5 p-4 text-left"
              data-testid="card-no-gaps"
            >
              <p className="font-semibold text-foreground">
                Strong baseline — no critical gaps identified
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Where the Twister fits for you is fleet depth and onboard edge AI — an
                NVIDIA Jetson Orin NX processes imagery in the air for immediate scene
                assessment.
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Score reflects capability vs. mission requirements; organization type and
            timeline are not scored.
          </p>
          <button
            type="button"
            onClick={onEditAnswers}
            className="text-sm text-primary underline-offset-4 hover:underline"
            data-testid="button-edit-answers"
          >
            Edit my answers
          </button>
        </CardContent>
      </Card>

      <Card data-testid="card-lead-form">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Get your full Mission Fit Report
          </CardTitle>
          <p className="text-muted-foreground text-center">
            A personalized breakdown of your score, your gaps, and exactly where the
            Twister fits your missions — plus priority on the West Coast live-demo list.
          </p>
        </CardHeader>
        <CardContent>
          <LeadCaptureForm answers={answers} result={result} onSuccess={onSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}

function SuccessCard({ score }: { score: number }) {
  return (
    <Card className="max-w-2xl mx-auto" data-testid="card-success">
      <CardContent className="p-8 text-center space-y-4">
        <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">
          Mission Fit Report requested
        </h3>
        <p className="text-muted-foreground">
          Your readiness score of {score}/100 and assessment answers are with our team.
          We'll email your personalized Mission Fit Report and reach out when the
          Twister flies in your region — you're on the priority list.
        </p>
      </CardContent>
    </Card>
  );
}

const SPEC_HIGHLIGHTS = [
  {
    icon: Plane,
    title: "VTOL to winged flight",
    description:
      "Launches vertically like a multirotor, transitions to efficient winged flight — no catapult, no runway.",
  },
  {
    icon: Timer,
    title: "Approx. 2-minute deploy",
    description:
      "From case to airborne in about 2 minutes, by a single operator in the field.",
  },
  {
    icon: Radar,
    title: "Up to 15 km radius",
    description:
      "Operating radius up to 15 km from the launch point, at altitudes up to approx. 3,700 m.",
  },
  {
    icon: Clock,
    title: "Up to 90 min endurance",
    description:
      "Winged flight profile holds a parking orbit for persistent stare over the scene.",
  },
  {
    icon: Moon,
    title: "Nighthawk2 EO/IR",
    description:
      "Day and thermal imaging channels in one gimbal — swappable in the field without tools.",
  },
  {
    icon: Cpu,
    title: "Onboard AI processing",
    description:
      "NVIDIA Jetson Orin NX processes imagery in the air for immediate scene analysis.",
  },
  {
    icon: Lock,
    title: "AES-256 encrypted link",
    description: "Dual-band, AES-256-encrypted data link between aircraft and operator.",
  },
  {
    icon: Boxes,
    title: "DronePort compatible",
    description:
      "A single DronePort stores and charges up to three Twisters, ready for the next mission.",
  },
];

function SpecHighlights() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2
            className="text-3xl lg:text-4xl font-bold text-foreground"
            data-testid="text-specs-title"
          >
            Meet the Twister
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Quantum Systems' tactical eVTOL ISR platform — a 3.8 kg aircraft that
            deploys like a multirotor and covers ground like a fixed wing.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPEC_HIGHLIGHTS.map((item, index) => (
            <Card key={item.title} className="hover-elevate" data-testid={`card-spec-${index}`}>
              <CardHeader>
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mb-4 flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-8">
          Performance figures per Quantum Systems published materials; actual
          performance varies with configuration and conditions.
        </p>
      </div>
    </section>
  );
}

function WhyInsightUp() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2
              className="text-2xl lg:text-3xl font-bold text-foreground"
              data-testid="text-why-title"
            >
              West Coast based, hands-on with the platform
            </h2>
            <p className="text-muted-foreground">
              We're not a catalog reseller. We operate Quantum Systems aircraft in real
              field programs on the California coast, and we've watched the Twister fly
              live — VTOL launch, transition, parking orbit, sensor work — at an
              FAA-designated UAS test range.
            </p>
            <p className="text-muted-foreground">
              When you talk to us, you're talking to people who plan missions, swap
              payloads, and file the paperwork — not a sales script.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              What working with us looks like
            </h2>
            <ul className="space-y-3">
              {[
                "A Mission Fit Report grounded in your actual answers — not a generic brochure",
                "Straight talk on where the Twister fits your missions, and where it doesn't",
                "Live-demo coordination on the West Coast as events are scheduled",
                "Support through evaluation, procurement questions, and fielding",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-2"
                  data-testid={`text-why-item-${index}`}
                >
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    question: "Who is this assessment for?",
    answer:
      "Public-safety, search & rescue, fire, port and critical-infrastructure security teams, and government agencies on the West Coast evaluating tactical ISR aircraft. Private operators are welcome too — the scoring works the same way.",
  },
  {
    question: "How is the score calculated?",
    answer:
      "Four capability pillars — current aerial assets, night/thermal capability, field deployment model, and how well your capabilities match your stated mission requirements — each worth 25 points. Organization type and procurement timeline are never scored. A high score means you're well equipped, and we'll tell you so honestly.",
  },
  {
    question: "What's in the Mission Fit Report?",
    answer:
      "A personalized breakdown of your score, the capability gaps we identified, and a straight assessment of where the Twister fits your mission set — prepared by our team from your actual answers and emailed to you.",
  },
  {
    question: "How do live demos work?",
    answer:
      "We coordinate Twister demonstrations on the West Coast as events are scheduled. Completing the assessment puts you on the priority list — we'll contact you directly to arrange details. There's no self-serve calendar.",
  },
  {
    question: "What happens to my answers?",
    answer:
      "They're used only to prepare your Mission Fit Report and follow up with you. We don't share or sell them.",
  },
];

function TwisterFAQ() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-10">
          <h2
            className="text-3xl lg:text-4xl font-bold text-foreground"
            data-testid="text-faq-title"
          >
            Questions, answered
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger
                className="text-left"
                data-testid={`accordion-faq-${index}`}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default function TwisterReadinessPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ReadinessResult | null>(null);

  const startQuiz = () => {
    if (phase === "intro") setPhase("quiz");
    document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelect = (id: QuestionId, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (stepIndex === QUESTIONS.length - 1) {
      setResult(computeReadiness(answers));
      setPhase("reveal");
      return;
    }
    setDirection(1);
    setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      setPhase("intro");
      return;
    }
    setDirection(-1);
    setStepIndex((i) => i - 1);
  };

  const handleEditAnswers = () => {
    setPhase("quiz");
    setStepIndex(QUESTIONS.length - 1);
    setDirection(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="ISR Mission Readiness Score — Twister Tactical eVTOL Assessment | Insight Up Solutions"
        description="Take the 2-minute ISR Mission Readiness assessment for public-safety, SAR, fire, and critical-infrastructure teams. Get your 0-100 readiness score, identified capability gaps, and a personalized Quantum Systems Twister Mission Fit Report."
        ogTitle="What's Your ISR Mission Readiness Score?"
        ogDescription="8 questions. 2 minutes. A 0-100 readiness score plus a personalized Mission Fit Report for the Quantum Systems Twister tactical eVTOL."
      />
      <Header cartItemCount={0} />

      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <Badge variant="secondary" className="mb-4" data-testid="badge-twister">
                Quantum Systems Twister · Tactical eVTOL ISR
              </Badge>
              <h1
                className="text-4xl lg:text-5xl font-bold text-foreground"
                data-testid="text-twister-title"
              >
                How mission-ready is your aerial ISR program?
              </h1>
              <p
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
                data-testid="text-twister-subtitle"
              >
                8 questions, 2 minutes. Get your 0–100 ISR Readiness Score, see your
                capability gaps, and get a personalized Twister Mission Fit Report —
                from the West Coast team that flies this class of aircraft.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-foreground font-semibold">
                <span className="flex items-center gap-2" data-testid="text-stat-radius">
                  <Radar className="h-5 w-5 text-primary" />
                  Up to 15 km radius
                </span>
                <span className="flex items-center gap-2" data-testid="text-stat-endurance">
                  <Clock className="h-5 w-5 text-primary" />
                  Up to 90 min endurance
                </span>
                <span className="flex items-center gap-2" data-testid="text-stat-deploy">
                  <Timer className="h-5 w-5 text-primary" />
                  Approx. 2-min deploy
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" onClick={startQuiz} data-testid="button-start-assessment">
                  Get My Readiness Score
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Assessment funnel */}
        <section id="assessment" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {phase === "intro" && (
              <Card className="max-w-2xl mx-auto" data-testid="card-quiz-intro">
                <CardContent className="p-8 text-center space-y-4">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                    The ISR Mission Readiness Assessment
                  </h2>
                  <p className="text-muted-foreground">
                    8 questions about your missions, your current capability, and your
                    requirements. You'll get a 0–100 readiness score, your capability
                    gaps, and a personalized Mission Fit Report.
                  </p>
                  <Button size="lg" onClick={() => setPhase("quiz")} data-testid="button-quiz-start">
                    Start the Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
            {phase === "quiz" && (
              <QuizStepCard
                stepIndex={stepIndex}
                direction={direction}
                answers={answers}
                onSelect={handleSelect}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}
            {phase === "reveal" && result && (
              <ScoreReveal
                answers={answers}
                result={result}
                onEditAnswers={handleEditAnswers}
                onSuccess={() => setPhase("submitted")}
              />
            )}
            {phase === "submitted" && result && <SuccessCard score={result.score} />}
          </div>
        </section>

        <SpecHighlights />
        <WhyInsightUp />
        <TwisterFAQ />

        {/* Final CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground"
              data-testid="text-final-cta-title"
            >
              Two minutes to your readiness score
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Know where your ISR program stands — and exactly where the Twister fits.
            </p>
            <Button size="lg" onClick={startQuiz} data-testid="button-final-cta">
              Get My Readiness Score
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
