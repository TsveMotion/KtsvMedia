import type { Metadata } from 'next';
import { defaultMetadata } from './metadata-config';
import HomeClient from '@/components/home/HomeClient';

export const metadata: Metadata = {
  ...defaultMetadata,
  alternates: {
    canonical: 'https://www.ktsvmedia.com'
  }
};

export default function HomePage() {
  return <HomeClient />;
}
