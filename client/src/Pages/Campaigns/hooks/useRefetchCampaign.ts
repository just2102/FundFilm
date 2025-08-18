import { useQuery } from "@tanstack/react-query";
import { fetchCampaignById } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";

export const useRefetchCampaign = (campaignId: string | undefined) => {
  const contract = useCustomSelector().web3.contract;
  const dispatch = useCustomDispatch();
  useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => {
      if (!contract || !campaignId) return null;

      return dispatch(fetchCampaignById({ contract, campaignId }));
    },
    refetchInterval: 5_000,
    refetchOnWindowFocus: false,
  });
};
