import { motion } from "framer-motion";
import { User, CheckCircle, AlertCircle } from "lucide-react";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProfileCompletionCard() {
  const { completionPercentage, isComplete, missingFields } = useProfileCompletion();
  const navigate = useNavigate();

  if (isComplete) {
    return (
      <motion.div
        className="glass rounded-xl p-4 border border-green-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Profile Complete!</h4>
            <p className="text-xs text-muted-foreground">
              You've unlocked the First Steps achievement
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass rounded-xl p-4 border border-amber-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            Complete Your Profile
            <span className="text-xs text-amber-400 font-normal">
              +10 points
            </span>
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add the following to unlock the "First Steps" achievement
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium text-foreground">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </div>

      {/* Missing fields */}
      <div className="flex flex-wrap gap-1 mb-3">
        {missingFields.map((field) => (
          <motion.span
            key={field}
            className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {field}
          </motion.span>
        ))}
      </div>

      <Button 
        size="sm" 
        className="w-full"
        onClick={() => navigate("/profile")}
      >
        Complete Profile
      </Button>
    </motion.div>
  );
}
