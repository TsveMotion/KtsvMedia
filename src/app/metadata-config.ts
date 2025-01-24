import type { Metadata } from 'next'

const defaultKeywords = [
  'digital media',
  'media consulting',
  'video consultations',
  'digital marketing',
  'brand growth',
  'online presence',
  'media strategy',
  'business growth',
  'digital transformation',
  'marketing solutions',
  'professional consulting',
  'brand development'
]

export const defaultMetadata: Metadata = {
  title: {
    default: 'KtsvMedia | Transform Your Digital Presence',
    template: '%s | KtsvMedia'
  },
  description: 'Expert media solutions to elevate your brand and transform your digital presence. Book a free 30-minute consultation today.',
  keywords: defaultKeywords.join(', '),
  authors: [{ name: 'KtsvMedia Team' }],
  creator: 'KtsvMedia',
  publisher: 'KtsvMedia',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ktsvmedia.com',
    siteName: 'KtsvMedia',
    title: 'KtsvMedia - Transform Your Digital Presence',
    description: 'Expert media solutions to elevate your brand and transform your digital presence. Book a free 30-minute consultation today.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KtsvMedia - Transform Your Digital Presence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KtsvMedia - Transform Your Digital Presence',
    description: 'Expert media solutions to elevate your brand and transform your digital presence. Book a free 30-minute consultation today.',
    images: ['/twitter-image.jpg'],
    creator: '@ktsvmedia',
  },
}
