import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-products-page-title">
              Our Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-products-page-description">
              Professional UAV solutions for every mission. From the Trinity Pro platform to advanced payloads and software solutions.
            </p>
          </div>
          
          <ProductGrid 
            title="All Products"
            subtitle="Complete range of UAV solutions"
            showViewAll={false}
            maxProducts={20}
            dataTestIdPrefix="all-products"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}