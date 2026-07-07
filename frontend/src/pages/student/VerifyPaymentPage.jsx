
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyPayment } from "@/hooks/useVerifyPayment";

const VerifyPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();

  const { mutate } = useVerifyPayment();

  useEffect(() => {
  if (reference) {
    mutate(reference, {
      onSuccess: () => {
        navigate("/my-learning");
      },
    });
  }
}, [reference, mutate, navigate]);

  return <div>Verifying payment...</div>;
};

export default VerifyPaymentPage;