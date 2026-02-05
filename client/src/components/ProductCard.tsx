import { motion } from "framer-motion";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { user } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative minecraft-card overflow-hidden flex flex-col h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6 flex flex-col items-center flex-grow">
        <div className="w-full aspect-square mb-6 rounded-lg bg-black/20 flex items-center justify-center p-4 border border-white/5 group-hover:border-primary/30 transition-colors">
          <img 
            src={product.imageUrl || "https://images.unsplash.com/photo-1627856014759-2a01d4740159?w=300&h=300&fit=crop"} 
            alt={product.name}
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <div className="text-center space-y-2 w-full">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            {product.type}
          </div>
          
          <h3 className="text-2xl font-minecraft text-white drop-shadow-md">
            {product.name}
          </h3>
          
          <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto w-full space-y-4 relative z-10">
        <div className="flex items-center justify-center">
          <span className="text-3xl font-minecraft text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            ${(product.price / 100).toFixed(2)}
          </span>
        </div>

        {user && onEdit && onDelete ? (
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => onEdit(product)}
              className="w-full border-white/20 hover:bg-white/10 hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDelete(product.id)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        ) : (
          <button className="w-full minecraft-btn flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-white/50">
            <ShoppingCart className="w-5 h-5" />
            BUY NOW
          </button>
        )}
      </div>
    </motion.div>
  );
}
