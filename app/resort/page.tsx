import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function AboutUsPage() {
  let resort = null;
  
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      console.log('Database not available, using fallback content...');
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About Simcate Gardens</h1>
              <p className="text-xl text-gray-600 mb-8">Resort information will be available when the database is connected.</p>
              <div className="mt-8">
                <img 
                  src="/uploads/resort_resort-1_1756070466330.jpg" 
                  alt="Simcate Gardens Resort"
                  className="mx-auto rounded-lg shadow-lg max-w-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      resort = await prisma.resort.findFirst({
    include: {
      facilities: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
  });
    }
  } catch (error) {
    console.error('Error fetching resort data:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Simcate Gardens</h1>
            <p className="text-xl text-gray-600">Unable to load resort information at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-sm font-medium backdrop-blur-sm">
              ✨ Our Story
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-8 leading-tight">
            About Simcate Gardens
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light">
            {resort?.description || "Discover the story behind our commitment to creating unforgettable experiences in paradise."}
          </p>
        </div>

        {/* Our Story Section */}
        <div className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block mb-6">
                <span className="text-4xl">🌴</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Where Luxury Meets
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Nature's Beauty
                </span>
              </h2>
              <div className="space-y-6 text-blue-100 leading-relaxed text-lg">
                <p className="opacity-90">
                  Founded in 2010, Simcate Gardens began as a vision to create a sanctuary where luxury meets nature. 
                  What started as a small beachfront property has evolved into a world-class resort that celebrates 
                  the beauty of tropical living while maintaining our commitment to environmental sustainability.
                </p>
                <p className="opacity-90">
                  Our founders, a group of passionate hospitality professionals, believed that every guest should 
                  experience the perfect blend of relaxation and adventure. Today, we continue to honor that vision 
                  by providing exceptional service, stunning accommodations, and unforgettable memories.
                </p>
                <p className="opacity-90">
                  Located on the pristine shores of Paradise Beach, our resort offers more than just a place to stay—it&apos;s 
                  a gateway to experiencing the natural beauty and cultural richness of our tropical paradise.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-1000"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/uploads/resort_resort-1_1756070466330.jpg"
                    alt="Simcate Gardens Resort"
                    width={800}
                    height={500}
                    className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">14+</div>
                    <div className="text-sm text-blue-200 font-medium">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-4xl">💎</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Core
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:border-pink-400/50 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Passion for Service</h3>
                <p className="text-blue-200 leading-relaxed">
                  We believe every interaction should exceed expectations, creating lasting memories for our guests.
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:border-emerald-400/50 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Environmental Stewardship</h3>
                <p className="text-blue-200 leading-relaxed">
                  Committed to sustainable practices that protect our beautiful natural environment for future generations.
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:border-purple-400/50 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Community Connection</h3>
                <p className="text-blue-200 leading-relaxed">
                  We&apos;re proud to support local communities and celebrate the rich cultural heritage of our region.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact Section */}
        <div className="mb-32">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
              <div className="text-center mb-12">
                <div className="inline-block mb-6">
                  <span className="text-4xl">📍</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Visit Our
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Paradise
                  </span>
                </h2>
                <p className="text-xl text-blue-200 max-w-2xl mx-auto">
                  Experience luxury in the heart of tropical paradise
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
                      </span>
                      Location
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start group">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-lg">{resort?.address || "123 Paradise Beach Road"}</p>
                          <p className="text-blue-300">Maui, Hawaii 96753</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center group">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        </div>
                        <p className="text-blue-200 text-lg">{resort?.phone || "+1 (808) 555-0123"}</p>
                      </div>
                      
                      <div className="flex items-center group">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        </div>
                        <p className="text-blue-200 text-lg">{resort?.email || "info@simcategardens.com"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </span>
                      Getting Here
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start group">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-lg">Kahului Airport (OGG)</p>
                          <p className="text-blue-300">45 minutes by car</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start group">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-lg">Complimentary Airport Shuttle</p>
                          <p className="text-blue-300">Available upon request</p>
        </div>
      </div>

                      <div className="flex items-start group">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-lg">Valet Parking</p>
                          <p className="text-blue-300">Complimentary for all guests</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-4xl">🏆</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Awards &
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Recognition
              </span>
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Celebrated excellence in hospitality and sustainability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:border-yellow-400/50 transition-all duration-500 group-hover:scale-105">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">🏆</div>
                <h3 className="text-xl font-bold text-white mb-2">TripAdvisor</h3>
                <p className="text-blue-200 font-medium">Travelers&apos; Choice 2023</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:border-blue-400/50 transition-all duration-500 group-hover:scale-105">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">⭐</div>
                <h3 className="text-xl font-bold text-white mb-2">Forbes Travel</h3>
                <p className="text-blue-200 font-medium">4-Star Resort</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:border-emerald-400/50 transition-all duration-500 group-hover:scale-105">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">🌿</div>
                <h3 className="text-xl font-bold text-white mb-2">Green Globe</h3>
                <p className="text-blue-200 font-medium">Sustainability Certified</p>
        </div>
      </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:border-purple-400/50 transition-all duration-500 group-hover:scale-105">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">💎</div>
                <h3 className="text-xl font-bold text-white mb-2">AAA</h3>
                <p className="text-blue-200 font-medium">4-Diamond Resort</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-16 text-center text-white overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

            <div className="relative z-10">
              <div className="inline-block mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to Experience
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Our Story?
                </span>
              </h3>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                Join thousands of satisfied guests who have discovered the magic of Simcate Gardens. 
                Book your stay today and become part of our story.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link
          href="/rooms"
                  className="group relative inline-block bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <span className="relative z-10">View Our Rooms</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/contact"
                  className="group relative inline-block border-2 border-white/50 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <span className="relative z-10">Contact Us</span>
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
