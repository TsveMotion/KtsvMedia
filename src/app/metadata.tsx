import type { Metadata } from 'next';
import { defaultMetadata } from './metadata-config';

const metadata: Metadata = {
  ...defaultMetadata,
  alternates: {
    canonical: 'https://www.ktsvmedia.com'
  }
};

export default metadata;
