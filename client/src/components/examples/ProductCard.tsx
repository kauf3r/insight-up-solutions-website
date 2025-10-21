import ProductCard from '../ProductCard';

const productImage = '/stock_images/high-tech_industrial_0d5a74ba.jpg';

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="trinity-pro"
        name="Trinity Pro UAV Platform"
        category="UAV Platform"
        description="Professional-grade UAV platform designed for mission-critical applications in surveying, agriculture, and public safety."
        image={productImage}
        price="Contact for Pricing"
        specifications={[
          "Flight time: Up to 45 minutes",
          "Max payload: 2.5kg",
          "Wind resistance: 15 m/s",
          "Operating temp: -10°C to +50°C"
        ]}
        featured={true}
        onQuoteRequest={() => console.log('Quote requested for Trinity Pro')}
      />
    </div>
  );
}