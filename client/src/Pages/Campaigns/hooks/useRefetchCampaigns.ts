import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { refetchCampaigns } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";

export const useRefetchCampaigns = () => {
  const contract = useCustomSelector().web3.contract;
  const dispatch = useCustomDispatch();

  useQuery({
    queryKey: ["campaigns"],
    queryFn: () => {
      if (!contract) return null;

      return dispatch(refetchCampaigns({ contract }));
    },
    refetchInterval: 5_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!contract,
  });
};
