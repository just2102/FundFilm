export const routes = {
  HOME: "/",
  PROFILE: "/profile",
  CAMPAIGNS: "/campaigns",
  CAMPAIGN: "/campaigns/:campaignId",
  MY_CAMPAIGNS: "/mycampaigns",
  ABOUT: "/about",
  campaign: (campaignId: string | number) => `/campaigns/${campaignId}`,
} as const;

export type RouteKey = keyof typeof routes;
