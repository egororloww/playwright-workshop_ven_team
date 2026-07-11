import { AboutUsHeader, JoinTheElite, OurMission, PageGrid, PageWrapper, UnmatchedQuality } from '@/components';

export const AboutUs = (): JSX.Element => {
  return (
    <PageWrapper>
      <PageGrid>
        <AboutUsHeader />
        <OurMission />
        <UnmatchedQuality />
        <JoinTheElite />
      </PageGrid>
    </PageWrapper>
  );
};
