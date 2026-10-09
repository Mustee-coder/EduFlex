import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { useVerifyPayment } from "@/hooks/useVerifyPayment";

const VerifyPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();
  const started = useRef(false);
  const { mutate, isPending, isError } = useVerifyPayment();

  const verify = () => {
    if (!reference) return;
    mutate(reference, { onSuccess: () => navigate("/my-learning", { replace: true }) });
  };

  useEffect(() => {
    if (reference && !started.current) {
      started.current = true;
      mutate(reference, { onSuccess: () => navigate("/my-learning", { replace: true }) });
    }
  }, [reference, mutate, navigate]);

  return (
    <section className="student-page mx-auto flex min-h-[60vh] max-w-5xl items-center px-4 py-8 sm:px-6" aria-live="polite">
      <div className="student-panel w-full p-6 text-center sm:p-9">
        {!reference ? (
          <><AlertCircle className="mx-auto mb-4 h-9 w-9 text-rose-600" aria-hidden="true" /><h1 className="text-xl font-semibold text-slate-900">Payment reference missing</h1><p className="mt-2 text-sm text-slate-600">Return to your courses and try enrollment again.</p><button type="button" onClick={() => navigate("/browse-courses")} className="student-button-primary mx-auto mt-5">Browse courses</button></>
        ) : isError ? (
          <><AlertCircle className="mx-auto mb-4 h-9 w-9 text-rose-600" aria-hidden="true" /><h1 className="text-xl font-semibold text-slate-900">We couldn’t verify your payment</h1><p className="mt-2 text-sm text-slate-600">Your enrollment hasn’t been confirmed. You can safely retry verification.</p><button type="button" onClick={verify} disabled={isPending} className="student-button-primary mx-auto mt-5 disabled:opacity-50">Try verification again</button></>
        ) : (
          <><LoaderCircle className="mx-auto mb-4 h-9 w-9 animate-spin text-indigo-700" aria-hidden="true" /><h1 className="text-xl font-semibold text-slate-900">Confirming your enrollment</h1><p className="mt-2 text-sm text-slate-600">We’re checking the payment with the provider. This can take a moment.</p></>
        )}
      </div>
    </section>
  );
};

export default VerifyPaymentPage;
