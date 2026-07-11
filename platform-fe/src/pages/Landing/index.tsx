import { lazy } from 'react';
const EliteFG = lazy(() => import('@/components/pages/landing/EliteFG'));
const WhyUs = lazy(() => import('@/components/pages/landing/WhyUs'));
const OurTopCars = lazy(() => import('@/components/pages/landing/OurTopCars'));
import { FAQLanding, Hero, PageGrid, PageWrapper } from '@/components';

export const Landing = (): JSX.Element => {
  return (
    <PageWrapper>
      <PageGrid>
        <Hero />
        <OurTopCars />
        <EliteFG />
        <WhyUs />
        <FAQLanding />
      </PageGrid>
    </PageWrapper>
  );
};
