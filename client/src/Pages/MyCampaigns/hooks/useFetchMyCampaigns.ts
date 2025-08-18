import { useQuery } from "@tanstack/react-query";
import { fetchMyCampaigns } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";

export const useFetchMyCampaigns = () => {
  const contract = useCustomSelector().web3.contract;
  const account = useCustomSelector().web3.account;
  const dispatch = useCustomDispatch();

  useQuery({
    queryKey: ["myCampaigns"],
    queryFn: () => {
      if (!contract || !account) return null;

      return dispatch(fetchMyCampaigns({ contract, account }));
    },
    refetchInterval: 10_000,
    refetchOnWindowFocus: false,
  });
};
