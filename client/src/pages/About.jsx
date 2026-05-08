import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, ThumbsUp, Users, History, Target, Award } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: <Heart className="text-red-500" />, title: "Compassion", desc: "We care for your health like our own family." },
    { icon: <ShieldCheck className="text-blue-500" />, title: "Quality", desc: "Only genuine, high-quality medications from top brands." },
    { icon: <ThumbsUp className="text-green-500" />, title: "Integrity", desc: "Transparent pricing and honest medical guidance." },
    { icon: <Users className="text-purple-500" />, title: "Community", desc: "Proudly serving Kukatpally for over a decade." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-med-light-blue py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Trusted Healthcare Partner Since <span className="text-med-blue">2010</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              MediCare Plus Pharmacy was founded with a single mission: to provide the community of Hyderabad with access to genuine medicines and expert pharmaceutical advice.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="w-full h-[400px] bg-white rounded-3xl shadow-2xl border-8 border-white overflow-hidden flex items-center justify-center">
                 <History size={160} className="text-med-blue opacity-10" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-8xl font-black text-med-blue opacity-5">14+</p>
                 </div>
              </div>
              <div className="absolute -bottom-10 -left-10 bg-med-blue text-white p-8 rounded-3xl shadow-xl max-w-[250px]">
                <p className="text-4xl font-bold mb-2">14 Years</p>
                <p className="text-sm font-bold opacity-80">Of Excellence in Healthcare Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-12 rounded-3xl">
              <Target className="text-med-blue mb-6" size={48} />
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To empower individuals to take control of their health by providing reliable medications, health education, and professional guidance in a caring environment.
              </p>
            </div>
            <div className="bg-med-blue p-12 rounded-3xl text-white shadow-xl">
              <Award className="text-white/80 mb-6" size={48} />
              <h2 className="text-3xl font-bold mb-6 text-white">Our Promise</h2>
              <p className="text-blue-50 leading-relaxed text-lg italic">
                "We promise to never compromise on the quality of medicines and to always be available for our customers when they need medical guidance."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Authorized & Licensed</h2>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
             <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={64} />
                <span className="font-bold text-sm uppercase tracking-widest">Drug Control Dept</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Award size={64} />
                <span className="font-bold text-sm uppercase tracking-widest">ISO Certified</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Users size={64} />
                <span className="font-bold text-sm uppercase tracking-widest">PCI Registered</span>
             </div>
          </div>
          <div className="mt-16 p-8 bg-med-light-blue rounded-3xl border border-blue-100">
             <p className="text-xl font-bold text-med-blue">Pharmacy License No: TS-PHARM-2010-04521</p>
             <p className="text-gray-500 mt-2 font-medium">Valid for the state of Telangana, India.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
