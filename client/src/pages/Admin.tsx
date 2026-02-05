import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useSettings, useUpdateSetting } from "@/hooks/use-settings";
import { useAuth } from "@/hooks/use-auth";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Loader2, Settings as SettingsIcon, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Product, type ProductInput } from "@shared/schema";
import { z } from "zod";

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: products } = useProducts();
  const { data: settings } = useSettings();
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const updateSettingMutation = useUpdateSetting();
  
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductInput>>({
    type: "rank",
    category: "general",
    price: 0
  });

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-4"><h1>Access Denied</h1><Button onClick={() => window.location.href = "/"}>Go Home</Button></div>;

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData(product);
    } else {
      setSelectedProduct(null);
      setFormData({ type: "rank", category: "general", price: 0, name: "", description: "", imageUrl: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Basic client-side check
      if (!formData.name || !formData.description || !formData.imageUrl || !formData.price) {
        toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: formData.imageUrl,
        type: formData.type as "rank" | "crate",
        category: formData.category || "misc"
      };

      if (selectedProduct) {
        await updateMutation.mutateAsync({ id: selectedProduct.id, ...payload });
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: "Success", description: "Product created successfully" });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Deleted", description: "Product removed" });
    }
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await updateSettingMutation.mutateAsync({ key, value });
      toast({ title: "Saved", description: "Setting updated" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update setting", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32">
        <h1 className="text-4xl font-minecraft text-white mb-8 border-b border-white/10 pb-4">
          Admin Dashboard
        </h1>

        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="products" className="font-minecraft text-lg data-[state=active]:bg-primary">
              <Package className="w-4 h-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-minecraft text-lg data-[state=active]:bg-primary">
              <SettingsIcon className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex justify-end mb-8">
              <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/80 font-minecraft text-lg">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onEdit={handleOpenDialog}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl bg-secondary/50 p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-minecraft text-white mb-6">Global Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Server IP Address</Label>
                  <div className="flex gap-2">
                    <Input 
                      defaultValue={settings?.find(s => s.key === "server_ip")?.value}
                      id="server_ip"
                      className="bg-black/50 border-white/10 text-white" 
                    />
                    <Button 
                      onClick={() => handleUpdateSetting("server_ip", (document.getElementById("server_ip") as HTMLInputElement).value)}
                      className="bg-primary hover:bg-primary/80"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Discord Invite Link</Label>
                  <div className="flex gap-2">
                    <Input 
                      defaultValue={settings?.find(s => s.key === "discord_link")?.value}
                      id="discord_link"
                      className="bg-black/50 border-white/10 text-white" 
                    />
                    <Button 
                      onClick={() => handleUpdateSetting("discord_link", (document.getElementById("discord_link") as HTMLInputElement).value)}
                      className="bg-primary hover:bg-primary/80"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-secondary border-primary/20 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-minecraft text-2xl">
              {selectedProduct ? "Edit Product" : "New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={formData.name || ""} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-black/20 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description || ""} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="bg-black/20 border-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (cents)</Label>
                <Input 
                  type="number"
                  value={formData.price || 0} 
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  className="bg-black/20 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val: any) => setFormData({...formData, type: val})}
                >
                  <SelectTrigger className="bg-black/20 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-white/10 text-white">
                    <SelectItem value="rank">Rank</SelectItem>
                    <SelectItem value="crate">Crate Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image URL (PNG)</Label>
              <Input 
                value={formData.imageUrl || ""} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://imgur.com/..."
                className="bg-black/20 border-white/10"
              />
              <p className="text-xs text-white/40">Paste a direct link to a PNG image.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/80 text-white font-minecraft">
              {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
              Save Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
