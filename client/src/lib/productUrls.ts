// Centralized product URL mapping
export const productIdToFriendlyUrl: Record<string, string> = {
  '46278773-9c53-4b47-b9f4-1c0a2b003ce1': 'trinity-pro',
  '03762537-a154-4265-9bab-a78a54235ac0': 'sony-ilx-lr1',
  '8e751853-6c57-40c2-a0e1-913256dba830': 'phase-one-p5',
  '86112e35-7e93-4f93-9675-6c3ef925f245': 'qube-640-lidar',
  '85d29b3b-64d2-4ad7-84e1-c7b12b72223e': 'oblique-d2m',
  'cb3b3d5c-4d55-41cd-a6e0-321bc3a82fed': 'qbase-3d',
  'fa2876eb-eaee-4355-a8d1-2fac3f7c4ce6': 'pix4dcatch',
  '2631e896-c5f9-47f9-8c4b-478295c68a09': 'pix4dcloud',
  '1f8350ee-bd62-44c8-af85-3e8ba6f6be24': 'correlator3d',
  '1dbf99a9-8851-4e76-81f1-b226e863fa6e': 'emlid-reach-rs3',
  '1ede3a62-0152-44c3-a41f-d5d6f6c6f960': 'emlid-reach-rx',
  '77471b9e-6522-4cce-9cc7-c3a5c23ea2e9': 'emlid-scanning-kit',
  '0f8d9f77-7f3f-4a90-a6f4-7ef3106b13f3': 'dragonfish-standard',
  '90ac85bc-f729-41e3-8344-79fc7bfb3285': 'dragonfish-pro'
};

export const friendlyUrlToProductId: Record<string, string> = {
  'trinity-pro': '46278773-9c53-4b47-b9f4-1c0a2b003ce1',
  'sony-ilx-lr1': '03762537-a154-4265-9bab-a78a54235ac0',
  'phase-one-p5': '8e751853-6c57-40c2-a0e1-913256dba830',
  'qube-640-lidar': '86112e35-7e93-4f93-9675-6c3ef925f245',
  'oblique-d2m': '85d29b3b-64d2-4ad7-84e1-c7b12b72223e',
  'qbase-3d': 'cb3b3d5c-4d55-41cd-a6e0-321bc3a82fed',
  'pix4dcatch': 'fa2876eb-eaee-4355-a8d1-2fac3f7c4ce6',
  'pix4dcloud': '2631e896-c5f9-47f9-8c4b-478295c68a09',
  'correlator3d': '1f8350ee-bd62-44c8-af85-3e8ba6f6be24',
  'emlid-reach-rs3': '1dbf99a9-8851-4e76-81f1-b226e863fa6e',
  'emlid-reach-rx': '1ede3a62-0152-44c3-a41f-d5d6f6c6f960',
  'emlid-scanning-kit': '77471b9e-6522-4cce-9cc7-c3a5c23ea2e9',
  'dragonfish-standard': '0f8d9f77-7f3f-4a90-a6f4-7ef3106b13f3',
  'dragonfish-pro': '90ac85bc-f729-41e3-8344-79fc7bfb3285'
};

export function getProductUrl(productId: string): string {
  return productIdToFriendlyUrl[productId] || productId;
}

export function getProductId(friendlyUrl: string): string {
  return friendlyUrlToProductId[friendlyUrl] || friendlyUrl;
}
