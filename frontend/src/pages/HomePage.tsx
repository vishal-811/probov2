import { TrendingUp, Trophy,  ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
   const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="bg-[#f5f5f5] border-b border-zinc-200 md:px-12">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
                Trading Made Simple
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-zinc-800">
                Trade Your <span className="text-blue-600">Opinions</span>,
                <br />Make Real <span className="text-blue-600">Profits</span>
              </h1>
              <p className="text-zinc-600 text-lg">
                Join thousands of traders who are turning their market insights into profitable opportunities. 
                Start trading opinions today and be part of the future of prediction markets.
              </p>
              <div className="flex gap-4">
                <button onClick={()=>navigate('/activemarket')} className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all hover:gap-4 shadow-lg shadow-zinc-600/20">
                  Start Trading <ArrowRight className="w-5 h-5" />
                </button> 
              </div>
              <div className="flex gap-8 pt-8">
                <div>
                  <p className="text-3xl font-bold text-zinc-800">50K+</p>
                  <p className="text-zinc-600">Active Traders</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-zinc-800">₹10M+</p>
                  <p className="text-zinc-600">Trading Volume</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-zinc-800">95%</p>
                  <p className="text-zinc-600">Success Rate</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl p-8">
                <img 
                  src="/api/placeholder/600/400"
                  alt="Trading Platform Interface"
                  className="rounded-xl shadow-2xl"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-zinc-800">Top Trader</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-800">
            Why Choose <span className="text-blue-600">OpinionTrade</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-blue-600" />}
              title="Intuitive Trading"
              description="Easy-to-use platform designed for both beginners and experts"
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-blue-600" />}
              title="Secure & Reliable"
              description="Your funds and data are protected with bank-grade security"
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-blue-600" />}
              title="Real-time Updates"
              description="Get instant market updates and execute trades quickly"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-800">
            Start Trading in <span className="text-blue-600">Three Steps</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard 
              number="01"
              title="Create Account"
              description="Sign up in minutes with just your email and phone number"
            />
            <StepCard 
              number="02"
              title="Deposit Funds"
              description="Add money to your wallet using various payment methods"
            />
            <StepCard 
              number="03"
              title="Start Trading"
              description="Choose your markets and start trading immediately"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-zinc-800">
            Ready to Start Trading?
          </h2>
          <p className="text-zinc-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful traders who are already profiting from their opinions.
            Start your journey today.
          </p>
          {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full flex items-center gap-2 mx-auto transition-all hover:gap-4 shadow-lg shadow-blue-600/20">
            Create Free Account <ChevronRight className="w-5 h-5" />
          </button> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-zinc-800">OpinionTrade</span>
              </div>
              <p className="text-zinc-600">
                Your trusted platform for opinion trading and market predictions.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-zinc-800">Product</h3>
              <ul className="space-y-2 text-zinc-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-zinc-800">Company</h3>
              <ul className="space-y-2 text-zinc-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-zinc-800">Support</h3>
              <ul className="space-y-2 text-zinc-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-200 mt-12 pt-8 text-center text-zinc-600">
            <p>© 2024 OpinionTrade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description } : any) => (
  <div className="bg-white p-6 rounded-xl hover:shadow-xl transition-all duration-300 border border-zinc-200">
    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-zinc-800">{title}</h3>
    <p className="text-zinc-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description } : any) => (
  <div className="relative p-6 rounded-xl border border-zinc-200 hover:border-blue-600/50 hover:shadow-xl transition-all duration-300 bg-white">
    <span className="text-4xl font-bold text-blue-600/20 absolute top-4 right-4">{number}</span>
    <h3 className="text-xl font-bold mb-2 text-zinc-800">{title}</h3>
    <p className="text-zinc-600">{description}</p>
  </div>
);

export default LandingPage;