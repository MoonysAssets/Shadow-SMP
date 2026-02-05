import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Store() {
  const { data: products, isLoading } = useProducts();
  const [filter, setFilter] = useState<"all" | "rank" | "crate">("all");
  const [search, setSearch] = useState("");

  const filteredProducts = products
    ?.filter(p => filter === "all" || p.type === filter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen pb-20 bg-[url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop')] bg-fixed bg-cover bg-center">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      <div className="relative z-10">
        <Navigation />
        
        <div className="container mx-auto px-4 pt-32">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-minecraft text-white mb-4 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
              SERVER <span className="text-primary">STORE</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Support the server and get amazing rewards. All purchases are final and help keep the server running!
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 w-full md:w-auto">
              {["all", "rank", "crate"].map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "ghost"}
                  onClick={() => setFilter(type as any)}
                  className={`font-minecraft text-lg capitalize ${filter === type ? 'bg-primary text-white' : 'text-white/60 hover:text-white'}`}
                >
                  {type === "all" ? "All Items" : `${type}s`}
                </Button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && filteredProducts?.length === 0 && (
            <div className="text-center py-20 text-white/40">
              <p className="text-2xl font-minecraft">No items found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
