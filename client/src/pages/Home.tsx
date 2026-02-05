import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useSettings, useServerStatus } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import { Copy, Users, Gamepad2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { data: settings } = useSettings();
  const { data: status } = useServerStatus();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const serverIp = settings?.find(s => s.key === "server_ip")?.value || "play.shadowsmp.com";
  const discordLink = settings?.find(s => s.key === "discord_link")?.value || "#";

  const handleCopyIp = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    toast({
      title: "IP Copied!",
      description: "See you on the server!",
      className: "bg-primary text-white border-none",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-9xl font-minecraft mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              SHADOW SMP
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 font-light">
              Experience the ultimate Minecraft adventure. Custom enchants, unique crates, and a community like no other.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center gap-8"
          >
            {/* IP Box */}
            <div 
              onClick={handleCopyIp}
              className="group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-primary blur-md opacity-50 group-hover:opacity-100 transition-opacity rounded-xl" />
              <div className="relative bg-black/80 border border-primary/50 rounded-xl px-8 py-4 flex items-center gap-4 hover:bg-black/90 transition-colors">
                <Gamepad2 className="w-6 h-6 text-primary animate-pulse" />
                <span className="font-minecraft text-2xl tracking-widest text-white">{serverIp}</span>
                <Copy className={`w-5 h-5 transition-colors ${copied ? 'text-green-400' : 'text-white/50 group-hover:text-white'}`} />
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-primary text-white text-xs py-1 px-3 rounded font-minecraft">CLICK TO COPY</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className={`w-3 h-3 rounded-full ${status?.online ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`} />
              <span className="text-white/80 font-minecraft text-lg">
                {status?.players.online || 0} / {status?.players.max || 100} PLAYERS ONLINE
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Custom Ranks", desc: "Stand out with unique prefixes and abilities.", color: "from-purple-500 to-indigo-500" },
            { title: "Epic Crates", desc: "Win legendary loot with our custom crate system.", color: "from-blue-500 to-cyan-500" },
            { title: "Discord Community", desc: "Join thousands of players in our active community.", color: "from-pink-500 to-rose-500" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="minecraft-card p-8 group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-6 transform group-hover:rotate-12 transition-transform shadow-lg`} />
              <h3 className="text-2xl text-white mb-3 font-minecraft">{feature.title}</h3>
              <p className="text-white/60 mb-6">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/20 via-purple-900/40 to-primary/20 p-12 rounded-3xl border border-primary/30 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <h2 className="text-4xl md:text-5xl font-minecraft text-white mb-6">Ready to start your journey?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Join our Discord server to meet the community, get support, and stay updated on events.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={discordLink} target="_blank" rel="noopener noreferrer">
              <button className="minecraft-btn bg-[#5865F2]/80 border-[#5865F2] hover:shadow-[0_6px_0_0_#404EED] hover:bg-[#5865F2]">
                Join Discord
              </button>
            </a>
            <Link href="/store">
              <Button variant="outline" className="h-[54px] px-8 text-lg font-minecraft border-white/20 hover:bg-white/10 text-white gap-2">
                Visit Store <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
