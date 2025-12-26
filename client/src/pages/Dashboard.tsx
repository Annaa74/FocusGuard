import { useState } from "react";
import { useAnalyzeFocus } from "@/hooks/use-focus";
import { FocusCard } from "@/components/FocusCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [goal, setGoal] = useState("Researching Neural Networks");
  const [content, setContent] = useState(
    "Neural networks are a subset of machine learning and are at the heart of deep learning algorithms. They are comprised of node layers, containing an input layer, one or more hidden layers, and an output layer."
  );

  const analyzeMutation = useAnalyzeFocus();

  const handleAnalyze = () => {
    if (!goal || !content) return;
    analyzeMutation.mutate({ goal, content });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">FocusGuard</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="#simulator" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Simulator
            </a>
            <Button size="sm" className="gap-2 rounded-full">
              <Download className="w-4 h-4" /> Download Extension
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Stay in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Flow State</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Prevent semantic drift with AI. Focus Guard analyzes your browsing context to ensure it aligns with your goals.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="simulator">
          
          {/* Simulator Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Focus Simulator</h2>
            </div>
            
            <FocusCard className="p-6 md:p-8 bg-white" delay={0.1}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">
                    Current Goal
                  </label>
                  <div className="relative">
                    <Brain className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="pl-10 h-12 text-lg bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/10 transition-all rounded-xl"
                      placeholder="What are you working on?"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground/80">
                    Page Content (Simulated)
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] p-4 bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/10 transition-all rounded-xl resize-none font-mono text-sm leading-relaxed"
                    placeholder="Paste text from a webpage here..."
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={analyzeMutation.isPending || !goal || !content}
                    className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-1px] active:translate-y-0 transition-all duration-300"
                  >
                    {analyzeMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 animate-spin" /> Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Analyze Context <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </FocusCard>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-bold">AI Analysis</h2>
            </div>

            <AnimatePresence mode="wait">
              {analyzeMutation.data ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <FocusCard className={`
                    p-8 h-full min-h-[400px] flex flex-col justify-center
                    ${analyzeMutation.data.isOnTrack 
                      ? "bg-gradient-to-br from-emerald-50 to-white border-emerald-100" 
                      : "bg-gradient-to-br from-rose-50 to-white border-rose-100"
                    }
                  `}>
                    <div className="flex flex-col items-center text-center space-y-6">
                      <StatusBadge 
                        isOnTrack={analyzeMutation.data.isOnTrack} 
                        score={analyzeMutation.data.relevanceScore} 
                      />
                      
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-foreground">
                          {analyzeMutation.data.isOnTrack 
                            ? "Laser Focused" 
                            : "Drift Detected"}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {analyzeMutation.data.reason}
                        </p>
                      </div>

                      {!analyzeMutation.data.isOnTrack && (
                        <div className="w-full pt-6 border-t border-rose-100">
                          <p className="text-sm font-medium text-rose-600 mb-3">
                            Recommendation
                          </p>
                          <div className="bg-white/80 p-4 rounded-xl text-sm text-foreground/80 shadow-sm border border-rose-100/50">
                            Pause for a moment. Does this content help you achieve "{goal}"?
                          </div>
                        </div>
                      )}
                    </div>
                  </FocusCard>
                </motion.div>
              ) : (
                <FocusCard key="empty" className="p-8 h-full min-h-[400px] flex items-center justify-center bg-muted/20 border-dashed">
                  <div className="text-center text-muted-foreground max-w-xs">
                    <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium">Ready to Analyze</p>
                    <p className="text-sm mt-2 opacity-70">
                      Enter your goal and some content to see the semantic analysis engine in action.
                    </p>
                  </div>
                </FocusCard>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Extension Info */}
        <div className="mt-24 bg-card rounded-3xl p-8 md:p-12 border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold">Get the Chrome Extension</h3>
              <p className="text-muted-foreground text-lg">
                The full experience runs directly in your browser. Install Focus Guard to get real-time nudges when you drift off-topic.
              </p>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm text-muted-foreground">
                Files available in: <span className="text-foreground font-semibold">client/public/extension/</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button size="lg" variant="outline" className="h-16 px-8 rounded-2xl text-lg gap-3 border-2 hover:bg-muted/50">
                <Download className="w-6 h-6" />
                Download Files
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
