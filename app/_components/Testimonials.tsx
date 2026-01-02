import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Ahmed",
    role: "General Physician",
    content:
      "I recommend Shastho to all my patients who find it difficult to visit clinics. Their sample collection is professional and reports are highly reliable.",
    image: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Rahman Kabir",
    role: "Senior Citizen",
    content:
      "The phlebotomist was very gentle and arrived exactly on time. Being able to do my regular checkups at home is a blessing for someone my age.",
    image: "https://i.pravatar.cc/150?u=rahman",
  },
  {
    name: "Nabila Ishrat",
    role: "Busy Professional",
    content:
      "Fast, efficient, and great UI. I booked a CBC and Lipid Profile during my lunch break and they came the next morning. Highly recommended!",
    image: "https://i.pravatar.cc/150?u=nabila",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-extrabold text-foreground mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-xl">
              Join thousands of happy customers who have switched to a smarter way of managing their health.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-background px-4 py-2 rounded-2xl shadow-sm border border-border">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
            </div>
            <span className="font-bold text-foreground">4.9/5 Rating</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-background p-8 rounded-[2rem] shadow-sm border border-border hover:shadow-xl transition-shadow relative group"
            >
              <Quote className="absolute top-8 right-8 w-10 h-10 text-muted-foreground/10 group-hover:text-primary/10 transition-colors" />
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <p className="text-xs font-medium text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed italic">&ldquo;{t.content}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
