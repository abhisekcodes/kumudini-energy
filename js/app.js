document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Theme Manager (Light / Dark / System Mode)
  // ==========================================
  // Global modal close references for keydown dismissal
  let closeModal = null;
  let closeStoryModal = null;

  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  if (themeToggle) {
    const iconMoon = themeToggle.querySelector('.icon-moon');
    const iconSun = themeToggle.querySelector('.icon-sun');
    const iconSystem = themeToggle.querySelector('.icon-system');

    if (iconMoon && iconSun && iconSystem) {
      // Check saved theme setting; default to 'system' to auto-detect device specifics
      let currentTheme = localStorage.getItem('theme') || 'system';

      // Apply theme to HTML tag and toggle visible icon
      function applyTheme(theme) {
        let targetTheme = theme;
        
        if (theme === 'system') {
          // Auto-detect system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          targetTheme = systemPrefersDark ? 'dark' : 'light';
        }

        htmlElement.setAttribute('data-theme', targetTheme);

        // Hide all icons
        iconSun.style.display = 'none';
        iconMoon.style.display = 'none';
        iconSystem.style.display = 'none';

        // Show icon corresponding to the ACTIVE SETTING
        if (theme === 'light') {
          iconSun.style.display = 'block';
        } else if (theme === 'dark') {
          iconMoon.style.display = 'block';
        } else {
          iconSystem.style.display = 'block';
        }
      }

      // Set and save theme selection
      function setTheme(theme) {
        currentTheme = theme;
        localStorage.setItem('theme', theme);
        applyTheme(theme);
      }

      // Cycle toggle click listener: Light -> Dark -> System -> Light
      themeToggle.addEventListener('click', () => {
        if (currentTheme === 'light') {
          setTheme('dark');
        } else if (currentTheme === 'dark') {
          setTheme('system');
        } else {
          setTheme('light');
        }
      });

      // Listen for OS preference switches in real-time
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentTheme === 'system') {
          applyTheme('system');
        }
      });

      // Initial application of theme
      applyTheme(currentTheme);
    }
  }

  // ==========================================
  // 2. Mobile Menu Toggle
  // ==========================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');

  if (mobileMenuToggle && navMenu && line1 && line2 && line3) {
    mobileMenuToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('mobile-active');
      
      // Toggle body scroll lock to prevent background scrolling
      if (isActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      
      // Animate hamburger menu lines
      if (isActive) {
        line1.setAttribute('x1', '5');
        line1.setAttribute('y1', '5');
        line1.setAttribute('x2', '19');
        line1.setAttribute('y2', '19');
        
        line2.style.opacity = '0';
        
        line3.setAttribute('x1', '5');
        line3.setAttribute('y1', '19');
        line3.setAttribute('x2', '19');
        line3.setAttribute('y2', '5');
      } else {
        resetHamburger();
      }
    });

    // Close mobile menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('mobile-active')) {
          navMenu.classList.remove('mobile-active');
          document.body.style.overflow = ''; // Restore scroll
          resetHamburger();
        }
      });
    });

    function resetHamburger() {
      line1.setAttribute('x1', '3');
      line1.setAttribute('y1', '12');
      line1.setAttribute('x2', '21');
      line1.setAttribute('y2', '12');
      
      line2.style.opacity = '1';
      
      line3.setAttribute('x1', '3');
      line3.setAttribute('y1', '18');
      line3.setAttribute('x2', '21');
      line3.setAttribute('y2', '18');
    }
  }

  // ==========================================
  // 3. Scroll Header Class & Active Section Link
  // ==========================================
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  if (header && sections.length > 0) {
    window.addEventListener('scroll', () => {
      // Scroll header shadow
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Active Section Link Highlight
      let currentSectionId = 'home';
      sections.forEach(sec => {
        const secId = sec.getAttribute('id');
        if (!secId) return; // Skip sections without an ID attribute to prevent menu flicker
        
        // Only trigger update if a navigation menu link exists for this section ID
        const hasLink = document.querySelector(`.nav-link[href="#${secId}"]`);
        if (!hasLink) return;
        
        const secTop = sec.offsetTop - 120;
        const secHeight = sec.clientHeight;
        if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
          currentSectionId = secId;
        }
      });

      if (navLinks.length > 0) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ==========================================
  // 4. Impact Counter Animation
  // ==========================================
  const impactNumbers = document.querySelectorAll('.impact-number');
  
  const observerOptions = {
    root: null,
    threshold: 0.2
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'), 10);
        const suffix = target.getAttribute('data-suffix') || '+';
        animateCounter(target, targetVal, suffix);
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  impactNumbers.forEach(num => counterObserver.observe(num));

  function animateCounter(element, target, suffix) {
    let start = 0;
    const duration = 1500; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic function
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * target);
      
      element.textContent = currentVal.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString('en-IN') + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ==========================================
  // 5. Product Category Filters
  // ==========================================
  const filterButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons and apply to this one
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter');

        productCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filterVal === 'all' || cardCategory === filterVal) {
            card.style.display = 'flex';
            card.style.animation = 'none';
            void card.offsetWidth; // Force browser layout reflow to re-trigger CSS animation
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });

        // Reset scroll position of products slider
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
          productsGrid.scrollLeft = 0;
        }
      });
    });
  }

  // ==========================================
  // 6. Interactive Specifications Modal
  // ==========================================
  const specModal = document.getElementById('spec-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackBtn = document.getElementById('modal-back-btn');
  const modalQuoteBtn = document.getElementById('modal-quote-btn');
  const modalProductTitle = document.getElementById('modal-product-title');
  const modalProductDesc = document.getElementById('modal-product-desc');
  const modalSpecsList = document.getElementById('modal-specs-list');

  // Specifications Data
  const productSpecs = new Map([
    ['grid-solar', {
      title: 'Grid-Tied Solar Plant',
      desc: 'Our high-efficiency grid-tied solar system integrates premium solar modules directly with the utility grid, enabling users to benefit from the net-metering framework in Odisha. It offers high economic ROI with simple operational maintenance.',
      specs: {
        'Module Efficiency': '21.2% Monocrystalline PERC half-cut technology',
        'Inverter Rating': 'IP65 dual MPPT controller, efficiency >98.6%',
        'Tariff Optimization': 'State Net-Metered grid integration',
        'Panel Warranty': '10-Year craftsmanship, 25-Year linear performance',
        'Grid Compatibility': 'TPODL, NESCO, WESCO grid regulatory standard certified'
      },
      interestVal: 'solar-ongrid'
    }],
    ['offgrid-solar', {
      title: 'Off-Grid Standalone System',
      desc: 'Designed for locations with limited or erratic grid connection, this off-grid solar platform employs robust hybrid controllers and advanced battery cells to store reliable backup power for essential loads day and night.',
      specs: {
        'Battery Storage': 'Premium Lithium Ferro Phosphate (LFP) / Tubular Gel',
        'Inverter Capacity': '1 kVA to 15 kVA with surge capacity (300%)',
        'MPPT Charging': '99% peak efficiency tracking',
        'Backup Duration': '8 hours (full load) to 18 hours (average loads)',
        'Applications': 'Offgrid homes, rural health clinics, micro-grids'
      },
      interestVal: 'solar-offgrid'
    }],
    ['prakti-stove', {
      title: 'Prakti Single-Burner Cookstove',
      desc: 'A heavy-duty biomass stove developed for households and community setups. By utilizing a double-walled insulation chamber, this stove maximizes thermal transfer and burns biomass cleanly, saving firewood and protecting health.',
      specs: {
        'Thermal Efficiency': '36.5% (certified clean thermal cook)',
        'Fuel Types': 'Firewood chips, dry twigs, agricultural briquettes',
        'Fuel Reduction': '55% wood savings over traditional clay chulhas',
        'Smoke Emissions': '75% reduction in particulate matter and carbon monoxide',
        'Material': 'Industrial cold-rolled structural steel, cast iron grate'
      },
      interestVal: 'biomass-stove'
    }],
    ['eco-chula', {
      title: 'Eco Chula Cookstove',
      desc: 'Affordable, robust, and highly portable. The Eco Chula is configured for rural families to burn standard firewood or garden twigs under optimized draft configurations, drastically lowering indoor pollution with minimum maintenance.',
      specs: {
        'Combustion System': 'Natural high-draft upward chamber feed',
        'Efficiency Rating': '28% thermal conversion efficiency',
        'Net Weight': '3.2 kilograms with cool-touch safety handles',
        'Accessories Included': 'Detachable ash container, wood feed regulator tray',
        'Lifespan': 'Built for 3+ years of intense daily cooking cycles'
      },
      interestVal: 'eco-chula'
    }],
    ['solar-freezer', {
      title: 'Solar DC Chest Freezer',
      desc: 'An agricultural-grade direct-drive DC refrigerator/freezer. Eliminates battery overheads by running directly from solar electricity during daylight hours and utilizing phase-change thermal storage locks overnight.',
      specs: {
        'Input Voltage': '12V / 24V DC automatic sensing input',
        'Operating Power': '45W - 65W low power brushless DC compressor',
        'Temperature Range': '-18°C up to +10°C (dual cooling thermostat)',
        'Insulation Material': '80mm thick polyurethane foam walling',
        'Solar Input Req.': '2 x 330W Solar PV modules (direct connection)'
      },
      interestVal: 'solar-freezer'
    }],
    ['led-pcbs', {
      title: 'LED Custom Circuit Boards & Drivers',
      desc: 'Specially fabricated industrial LED printed circuit boards (PCBs) and smart constant-current power drivers. Engineered to withstand high voltage variations and thermal stress typical of municipal streetlights and local grid surges.',
      specs: {
        'Surge Protection': '10kV integrated metal oxide varistors (MOVs)',
        'Power Factor': '>0.95 with low total harmonic distortion (THD <10%)',
        'Input Bounds': '140V to 320V AC operational range',
        'Board Core': 'High-conductivity aluminum metal-clad core (1.6mm)',
        'LED Chip Spec': 'High lumen efficacy chips, 140 lm/W'
      },
      interestVal: 'custom-electronics'
    }]
  ]);

  let activeProductInterest = 'other';

  // Define closeModal in outer scope for global event registration
  closeModal = function() {
    if (specModal) {
      specModal.classList.remove('active');
      specModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (specModal && modalClose && modalBackBtn && modalQuoteBtn && modalProductTitle && modalProductDesc && modalSpecsList) {
    const specCards = document.querySelectorAll('.product-card[data-product]');
    specCards.forEach(card => {
      card.addEventListener('click', () => {
        const productKey = card.getAttribute('data-product');
        const data = productSpecs.get(productKey);
        
        if (data) {
          modalProductTitle.textContent = data.title;
          modalProductDesc.textContent = data.desc;
          activeProductInterest = data.interestVal;
          
          // Build specs rows
          modalSpecsList.innerHTML = ''; // Safe static reset
          for (const [key, val] of Object.entries(data.specs)) {
            const row = document.createElement('div');
            row.className = 'modal-spec-row';
            
            const labelSpan = document.createElement('span');
            labelSpan.className = 'modal-spec-label';
            labelSpan.textContent = key;
            
            const valSpan = document.createElement('span');
            valSpan.className = 'modal-spec-value';
            valSpan.textContent = val;
            
            row.appendChild(labelSpan);
            row.appendChild(valSpan);
            modalSpecsList.appendChild(row);
          }
          
          // Open Modal
          specModal.classList.add('active');
          specModal.setAttribute('aria-hidden', 'false');
        }
      });

      // Keyboard accessibility support: trigger click on Enter or Space press
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    modalClose.addEventListener('click', closeModal);
    modalBackBtn.addEventListener('click', closeModal);
    
    specModal.addEventListener('click', (e) => {
      if (e.target === specModal) {
        closeModal();
      }
    });

    // Modal Action Redirect to Form
    modalQuoteBtn.addEventListener('click', () => {
      // Pre-select interest in contact form
      const interestSelect = document.getElementById('c-interest');
      if (interestSelect) {
        interestSelect.value = activeProductInterest;
      }
      
      closeModal();
      
      // Smooth scroll to form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================
  // 7. Interactive Leaflet Footprint Map
  // ==========================================
  const footprintData = new Map([
    ['keonjhar', {
      coords: [21.6289, 85.5817],
      badge: 'HQ & Central Operations',
      name: 'Keonjhar District',
      solar: '4.2 MW',
      biomass: '1,200',
      desc: "Serving as Kumudini Energy's headquarters, Keonjhar hosts our central solar integration workshop, along with over 150 off-grid solar-powered household systems and 4,500 clean cookstoves distributed across tribal villages."
    }],
    ['mayurbhanj', {
      coords: [22.0084, 86.4182],
      badge: 'Eastern Tribal Belt',
      name: 'Mayurbhanj District',
      solar: '1.8 MW',
      biomass: '850',
      desc: "Empowering local tribal artisans and schools with 1.8 MW of clean solar energy grids, supporting sustainable handicraft co-ops and 850 clean biomass cookstoves for educational kitchen spaces."
    }],
    ['sundargarh', {
      coords: [22.1185, 84.0378],
      badge: 'Northern Industrial Zone',
      name: 'Sundargarh District',
      solar: '2.5 MW',
      biomass: '500',
      desc: "Deploying 2.5 MW of solar net-metering and off-grid solutions for border enterprises and remote communities, paired with 500 eco-friendly cooking solutions for rural healthcare clinics."
    }],
    ['cuttack-khordha', {
      coords: [20.3500, 85.8500],
      badge: 'Central Urban Cluster',
      name: 'Cuttack & Khordha',
      solar: '5.6 MW',
      biomass: '300',
      desc: "Aggregating 5.6 MW of grid-connected rooftop solar installations across peri-urban MSMEs and residential clusters, reducing strain on the central grid while cutting carbon emissions."
    }],
    ['balasore', {
      coords: [21.4942, 86.9317],
      badge: 'Coastal Belt Operations',
      name: 'Balasore District',
      solar: '1.2 MW',
      biomass: '620',
      desc: "Supporting coastal aquaculture farms and local fisheries with 1.2 MW of off-grid solar power, driving clean-powered cold storage freezers and ice plants to preserve catches."
    }],
    ['ganjam', {
      coords: [19.3150, 84.7941],
      badge: 'Southern Agri-Hub',
      name: 'Ganjam District',
      solar: '2.1 MW',
      biomass: '950',
      desc: "Strengthening rural irrigation with 2.1 MW of agricultural solar water pumps, coupled with 950 clean biomass cookstoves distributed through local women's self-help groups (SHGs)."
    }],
    ['koraput', {
      coords: [18.8140, 82.7118],
      badge: 'Hilly Terrain Outreach',
      name: 'Koraput District',
      solar: '1.5 MW',
      biomass: '1,100',
      desc: "Overcoming challenging hilly terrain to install 1.5 MW of solar power for remote telecommunication towers, alongside 1,100 clean cookstoves at forest-edge villages."
    }]
  ]);

  const mapCanvas = document.getElementById('google-map');
  const infoCard = document.getElementById('map-info-card');
  const fpBadge = document.getElementById('region-badge');
  const fpName = document.getElementById('region-name');
  const fpSolar = document.getElementById('region-stat-solar');
  const fpBiomass = document.getElementById('region-stat-biomass');
  const fpDesc = document.getElementById('region-project-desc');

  let leafletMap = null;
  let tileLayer = null;
  const markers = new Map();
  let currentActiveKey = 'keonjhar';


  if (mapCanvas && infoCard) {
    // Hide fallback loader
    const fallbackEl = document.getElementById('map-fallback');
    if (fallbackEl) fallbackEl.style.display = 'none';
    mapCanvas.style.opacity = '1';

    // Initialize Leaflet Map centered on central Odisha
    leafletMap = L.map(mapCanvas, {
      center: [20.75, 85.50],
      zoom: 7.2,
      zoomControl: true,
      attributionControl: false
    });

    // Helper to get map tiles based on theme
    const getTileUrl = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      return theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    };

    // Apply initial tile layer
    tileLayer = L.tileLayer(getTileUrl(), {
      maxZoom: 19
    }).addTo(leafletMap);

    // Style helper for circle markers
    const getMarkerStyle = (isActive) => {
      return {
        radius: isActive ? 10 : 7,
        fillColor: isActive ? '#f59e0b' : '#0ea5e9',
        fillOpacity: isActive ? 1.0 : 0.8,
        color: '#ffffff',
        weight: isActive ? 2.5 : 1.5,
        opacity: 1.0
      };
    };

    const updateDetailsCard = (key) => {
      const data = footprintData.get(key);
      if (!data) return;

      infoCard.classList.add('updating');

      setTimeout(() => {
        if (fpBadge) fpBadge.textContent = data.badge;
        if (fpName) fpName.textContent = data.name;
        if (fpSolar) fpSolar.textContent = data.solar;
        if (fpBiomass) fpBiomass.textContent = data.biomass;
        if (fpDesc) fpDesc.textContent = data.desc;

        // Reset styling for all markers
        markers.forEach((marker, mKey) => {
          marker.setStyle(getMarkerStyle(mKey === key));
        });

        infoCard.classList.remove('updating');
      }, 300);
    };

    // Plot all markers on Leaflet map
    footprintData.forEach((data, key) => {
      const marker = L.circleMarker(data.coords, getMarkerStyle(key === currentActiveKey)).addTo(leafletMap);
      
      marker.bindTooltip(data.name, {
        direction: 'top',
        className: 'custom-map-tooltip'
      });

      markers.set(key, marker);

      marker.on('click', () => {
        handleUserInteraction(key);
      });
    });

    const handleUserInteraction = (key) => {
      currentActiveKey = key;
      if (leafletMap) {
        const activeData = footprintData.get(key);
        if (activeData) {
          leafletMap.panTo(activeData.coords, { animate: true, duration: 0.8 });
        }
      }
      updateDetailsCard(key);
    };

    // Initialize map card view
    updateDetailsCard('keonjhar');

    // Listen for theme toggle changes to update Leaflet tiles style
    const observer = new MutationObserver(() => {
      if (leafletMap && tileLayer) {
        leafletMap.removeLayer(tileLayer);
        tileLayer = L.tileLayer(getTileUrl(), {
          maxZoom: 19
        }).addTo(leafletMap);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Dynamic Form Pre-population
    const inquireBtn = infoCard.querySelector('.card-footer a');
    if (inquireBtn) {
      inquireBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const contactSection = document.getElementById('contact');
        const contactTitle = document.getElementById('contact-title');
        const districtSelect = document.getElementById('c-district');
        const requirementsText = document.getElementById('c-message');

        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }

        const activeData = footprintData.get(currentActiveKey);
        if (activeData) {
          if (contactTitle) {
            contactTitle.textContent = `Get In Touch - ${activeData.name}`;
          }
          if (districtSelect) {
            districtSelect.value = currentActiveKey;
          }
          if (requirementsText) {
            requirementsText.value = `Hi, I am interested in inquiring about solar/biomass projects in ${activeData.name}. (Solar Capacity: ${activeData.solar}, Stoves: ${activeData.biomass})`;
          }
        }
      });
    }
  }

  // ==========================================
  // 8. Contact Form Validator & Submission
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const successScreen = document.getElementById('success-screen');
  const successResetBtn = document.getElementById('btn-success-reset');

  if (contactForm && successScreen && successResetBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('c-name');
      const phoneInput = document.getElementById('c-phone');
      const emailInput = document.getElementById('c-email');

      if (nameInput && phoneInput && emailInput) {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();

        if (name && phone && email) {
          const submitBtn = contactForm.querySelector('.form-submit-btn');
          if (submitBtn) {
            const originalText = submitBtn.textContent;
            
            // Simulate API call state
            submitBtn.textContent = 'Sending Quote Request...';
            submitBtn.disabled = true;

            // Read chosen contact channel from radio inputs
            const methodInput = contactForm.querySelector('input[name="contact-method"]:checked');
            const chosenMethod = methodInput ? methodInput.value : 'whatsapp';

            setTimeout(() => {
              // Custom confirmation message based on contact preferences
              const successDesc = successScreen.querySelector('p');
              if (successDesc) {
                let methodText = 'phone call';
                if (chosenMethod === 'whatsapp') methodText = 'WhatsApp message';
                if (chosenMethod === 'email') methodText = 'email message';

                // Safe static clear and DOM building to prevent XSS
                successDesc.innerHTML = '';
                successDesc.appendChild(document.createTextNode('Thank you for reaching out to Kumudini Energy, '));
                const strongName = document.createElement('strong');
                strongName.textContent = name;
                successDesc.appendChild(strongName);
                successDesc.appendChild(document.createTextNode('. A technical representative from Keonjhar will contact you via '));
                const strongMethod = document.createElement('strong');
                strongMethod.textContent = methodText;
                successDesc.appendChild(strongMethod);
                successDesc.appendChild(document.createTextNode(' shortly.'));
              }

              // Show success screen
              successScreen.classList.add('show');
              
              // Reset button loading state
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
              
              // Reset form inputs
              contactForm.reset();
            }, 1200);
          }
        }
      }
    });

    successResetBtn.addEventListener('click', () => {
      successScreen.classList.remove('show');
      const contactTitle = document.getElementById('contact-title');
      if (contactTitle) {
        contactTitle.textContent = 'Get In Touch';
      }
    });
  }

  // ==========================================
  // 9. Impact Stories Modal Handler
  // ==========================================
  const storyModal = document.getElementById('story-modal');
  const storyModalClose = document.getElementById('story-modal-close');
  const storyModalBackBtn = document.getElementById('story-modal-back-btn');
  const storyModalTitle = document.getElementById('story-modal-title');
  const storyModalDate = document.getElementById('story-modal-date');
  const storyModalBody = document.getElementById('story-modal-body');

  const storyData = new Map([
    ['solar-weaver', {
      title: "Empowering Keonjhar's Rural Micro-Enterprises",
      date: "April 12, 2026",
      paragraphs: [
        { type: 'text', content: "For generations, the artisans of Bhatta Sahi in Keonjhar, Odisha, had their working hours dictated by the sun. With irregular grid power, weaving and pottery creation ground to a halt by 6:00 PM. In late 2024, Kumudini Energy deployed local off-grid solar plants with tubular battery banks for a cluster of 15 artisan households." },
        { type: 'highlight', prefix: "Today, these workshops are illuminated by high-efficiency LED lights powered entirely by solar energy. Artisan Ramesh Das shares, ", highlight: '"We can now work comfortably into the night, doubling our daily output. Our children also have reliable light to study. This has completely transformed our family income."' },
        { type: 'text', content: "The success of this cluster has inspired nearby communities to adopt clean energy cooperatives, proving that decentralized solar is the key to rural economic liberation." }
      ]
    }],
    ['sabitri-kitchen', {
      title: "A Breath of Fresh Air for Sabitri's Kitchen",
      date: "March 28, 2026",
      paragraphs: [
        { type: 'text', content: "Traditional cooking in rural Odisha relies heavily on mud chulhas fueled by wet firewood. Sabitri Naik, a mother of three from a village near Keonjhar, spent up to four hours daily gathering firewood and suffered from chronic coughing due to indoor smoke." },
        { type: 'text', content: "Through Kumudini Energy's clean cooking initiative, Sabitri received a high-efficiency Prakti Single-Burner Biomass Stove. This engineered stove uses an insulated combustion chamber that consumes 55% less fuel." },
        { type: 'highlight', prefix: '"I only need to gather wood twice a week now," Sabitri says. ', highlight: '"The stove burns hot and clean, with almost no smoke. My kitchen is clean, and my cough has disappeared."' },
        { type: 'text', content: "Sabitri has now become a local clean-cooking advocate, helping Kumudini Energy distribute over 200 stoves in her block." }
      ]
    }],
    ['lighting-streets', {
      title: "Illuminating Tribal Roads: Safe Streets in Keonjhar",
      date: "February 15, 2026",
      paragraphs: [
        { type: 'text', content: "Public safety in remote, forested blocks of Keonjhar District has long been compromised by pitch-black village roads. When darkness falls, wild animal movement and lack of visibility restricted travel." },
        { type: 'text', content: "Kumudini Energy engineered and installed a rugged network of 80 solar-powered LED streetlights equipped with custom-designed surge-resistant circuit boards. These systems withstand the intense humidity and grid voltage swings of rural Odisha." },
        { type: 'highlight', prefix: "Community leader Arabinda Das reports, ", highlight: '"Our roads are now safely illuminated from dusk till dawn. Women feel secure walking home from evening markets, and wild elephant incursions are easily spotted."' },
        { type: 'text', content: "This project highlights how localized green engineering resolves critical public safety challenges." }
      ]
    }],
    ['solar-freezer-story', {
      title: "Chilling Crops: Solar Cold Storage for Smallholder Farmers",
      date: "January 10, 2026",
      paragraphs: [
        { type: 'text', content: "In rural Keonjhar, vegetable farmers face severe losses during hot harvests due to immediate spoilage. Grid power cuts prevent refrigeration. In early 2025, Kumudini Energy set up a solar direct-drive DC cold storage cabinet in the local market cooperative." },
        { type: 'highlight', prefix: "Powered by three 330W monocrystalline panels, the freezer operates directly from solar energy without requiring expensive batteries. Farmer leader Binay Pradhan reports, ", highlight: '"We can now store our unsold tomatoes and pointed gourds overnight. This preserves freshness and prevents distress sales. Our earnings have stabilized by 35%."' },
        { type: 'text', content: "This local project proves how off-grid solar refrigeration resolves core agricultural supply challenges in Odisha." }
      ]
    }],
    ['school-meals', {
      title: "Clean Cooking for Schools: Mid-day Meal Impact",
      date: "May 8, 2026",
      paragraphs: [
        { type: 'text', content: "School kitchens preparing mid-day meals in rural blocks of Keonjhar have historically run on firewood and low-efficiency open hearths. Cooks stood in dense smoke for hours daily, and fuel sourcing depleted local forest canopies. In early 2026, Kumudini Energy installed commercial double-burner biomass stoves in three primary schools in Banspal." },
        { type: 'highlight', prefix: "Headmistress Anjali Jena shares, ", highlight: '"Our kitchen is now clean and completely smoke-free. The cooks no longer experience burning eyes, and the meals cook in half the time, letting us focus on teaching. We have reduced wood consumption by over 60%."' },
        { type: 'text', content: "By replacing smoky traditional cooking methods, this clean biomass cooking initiative creates a safer dining and learning environment for over 450 school children." }
      ]
    }],
    ['clinic-solar', {
      title: "Solar Power for Clinics: 24/7 Remote Healthcare",
      date: "April 30, 2026",
      paragraphs: [
        { type: 'text', content: "Rural health posts in remote areas of Keonjhar District have faced critical power cuts, disrupting vaccine cooling and emergency operations. In early 2026, Kumudini Energy engineered and installed a 3kW hybrid solar system with lithium battery storage at the Banspal community clinic." },
        { type: 'highlight', prefix: "Medical officer Dr. Bikash Mohanty reports, ", highlight: '"We can now keep critical vaccines stored safely at precise temperatures overnight. The solar system powers emergency lighting and diagnostics during power grid cuts, saving lives in emergency situations."' },
        { type: 'text', content: "This project underscores how localized clean solar micro-grids establish resilient public health infrastructure in underserved zones." }
      ]
    }]
  ]);

  // Define closeStoryModal in outer scope for global event registration
  closeStoryModal = function() {
    if (storyModal) {
      storyModal.classList.remove('active');
      storyModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (storyModal && storyModalClose && storyModalBackBtn && storyModalTitle && storyModalDate && storyModalBody) {
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
      card.addEventListener('click', () => {
        const storyKey = card.getAttribute('data-story');
        const data = storyData.get(storyKey);

        if (data) {
          storyModalTitle.textContent = data.title;
          storyModalDate.textContent = data.date;
          
          // Render stories safely by creating textNodes and elements instead of innerHTML variables assignment
          storyModalBody.innerHTML = ''; // Safe static clear
          
          data.paragraphs.forEach(p => {
            const para = document.createElement('p');
            para.style.marginBottom = '1.25rem';
            
            if (p.type === 'text') {
              para.textContent = p.content;
            } else if (p.type === 'highlight') {
              const prefixNode = document.createTextNode(p.prefix);
              const strongNode = document.createElement('strong');
              strongNode.textContent = p.highlight;
              
              para.appendChild(prefixNode);
              para.appendChild(strongNode);
            }
            storyModalBody.appendChild(para);
          });

          storyModal.classList.add('active');
          storyModal.setAttribute('aria-hidden', 'false');
        }
      });

      // Keyboard accessibility support: trigger click on Enter or Space press
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    storyModalClose.addEventListener('click', closeStoryModal);
    storyModalBackBtn.addEventListener('click', closeStoryModal);
    storyModal.addEventListener('click', (e) => {
      if (e.target === storyModal) {
        closeStoryModal();
      }
    });
  }

  // Removed Testimonials Modal Section

  // ==========================================
  // 11. Horizontal Scroll Sliders Controller
  // ==========================================
  const sliderContainers = document.querySelectorAll('.slider-container');
  sliderContainers.forEach(container => {
    const track = container.querySelector('.slider-track');
    const prevBtn = container.querySelector('.slider-arrow.prev');
    const nextBtn = container.querySelector('.slider-arrow.next');

    if (track && prevBtn && nextBtn) {
      // Scroll amount (width of one item + gap)
      const getScrollAmount = () => {
        const firstItem = track.firstElementChild;
        if (firstItem) {
          const style = window.getComputedStyle(firstItem);
          const marginRight = parseFloat(style.marginRight) || 0;
          const marginLeft = parseFloat(style.marginLeft) || 0;
          const width = firstItem.offsetWidth;
          const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
          return width + gap + marginRight + marginLeft;
        }
        return 350; // default fallback
      };

      // Update arrow visibility / disabled states based on scroll position
      const updateArrows = () => {
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        // Near the start
        if (scrollLeft <= 5) {
          prevBtn.classList.add('disabled');
          prevBtn.setAttribute('aria-disabled', 'true');
        } else {
          prevBtn.classList.remove('disabled');
          prevBtn.setAttribute('aria-disabled', 'false');
        }

        // Near the end
        if (scrollLeft >= maxScroll - 5) {
          nextBtn.classList.add('disabled');
          nextBtn.setAttribute('aria-disabled', 'true');
        } else {
          nextBtn.classList.remove('disabled');
          nextBtn.setAttribute('aria-disabled', 'false');
        }
      };

      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      });

      // Listen to scroll and resize events
      track.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      
      // Initial state check
      setTimeout(updateArrows, 150);
    }
  });

  // Global key listener to dismiss modals using the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof closeModal === 'function') closeModal();
      if (typeof closeStoryModal === 'function') closeStoryModal();
    }
  });

  // ==========================================
  // 12. Page Preloader
  // ==========================================
  const preloader = document.getElementById('page-preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 400);
    });
    // Safety timeout: remove preloader even if 'load' fires before this listener
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 3000);
  }

  // ==========================================
  // 13. Scroll Reveal Animation System
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  // Assign stagger indices to children of .stagger-children containers
  document.querySelectorAll('.stagger-children').forEach(container => {
    Array.from(container.children).forEach((child, index) => {
      child.classList.add('reveal');
      child.style.setProperty('--reveal-index', index);
    });
  });

  // Re-query after stagger children added
  const allRevealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (allRevealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    allRevealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  // 14. Back-to-Top Button
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 15. Hero Glowing Orbs Mouse-Parallax
  // ==========================================
  const heroSection = document.getElementById('home');
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  if (heroSection && orb1 && orb2) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { clientWidth, clientHeight } = heroSection;
      const xPercent = (clientX / clientWidth) - 0.5;
      const yPercent = (clientY / clientHeight) - 0.5;
      
      orb1.style.transform = `translate(${xPercent * 35}px, ${yPercent * 35}px)`;
      orb2.style.transform = `translate(${xPercent * -35}px, ${yPercent * -35}px)`;
    }, { passive: true });
    
    heroSection.addEventListener('mouseleave', () => {
      orb1.style.transform = 'translate(0px, 0px)';
      orb2.style.transform = 'translate(0px, 0px)';
    });
  }

  // ==========================================
  // 16. Interactive About Section Tabs Switcher
  // ==========================================
  const aboutTabButtons = document.querySelectorAll('.about-tab-btn');
  const aboutTabContents = document.querySelectorAll('.about-tab-content');
  const aboutTabsContainer = document.querySelector('.about-tabs');
  const aboutGlow = document.querySelector('.about-illustration-glow');

  if (aboutTabButtons.length > 0 && aboutTabContents.length > 0 && aboutTabsContainer) {
    // Dynamically build and append the sliding pill element
    let pill = aboutTabsContainer.querySelector('.about-tab-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.className = 'about-tab-pill';
      aboutTabsContainer.appendChild(pill);
    }

    function updatePillPosition(activeBtn) {
      if (!activeBtn || !pill) return;
      pill.style.left = `${activeBtn.offsetLeft}px`;
      pill.style.width = `${activeBtn.offsetWidth}px`;
    }

    // Initialize pill and active glow
    const activeBtn = aboutTabsContainer.querySelector('.about-tab-btn.active');
    if (activeBtn) {
      setTimeout(() => {
        updatePillPosition(activeBtn);
        if (aboutGlow) {
          aboutGlow.setAttribute('data-active-tab', activeBtn.getAttribute('data-tab'));
        }
      }, 150);
    }

    aboutTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        aboutTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        updatePillPosition(btn);

        if (aboutGlow) {
          aboutGlow.setAttribute('data-active-tab', targetTab);
        }
        
        aboutTabContents.forEach(content => {
          if (content.id === `about-${targetTab}`) {
            content.style.display = 'block';
            setTimeout(() => {
              content.classList.add('active');
            }, 10);
          } else {
            content.classList.remove('active');
            content.style.display = 'none';
          }
        });
      });
    });

    // Realign pill on resize
    window.addEventListener('resize', () => {
      const currentActive = aboutTabsContainer.querySelector('.about-tab-btn.active');
      if (currentActive) updatePillPosition(currentActive);
    }, { passive: true });
  }

  // (Section 17: Parallax logic removed for responsive gallery showcase)

  // ==========================================
  // 18. Contact Form Cursor-Tracking Glow Spotlight & Parallax Particles
  // ==========================================
  const contactCard = document.querySelector('.contact-form-card');
  if (contactCard) {
    const p1 = contactCard.querySelector('.particle-1');
    const p2 = contactCard.querySelector('.particle-2');
    const p3 = contactCard.querySelector('.particle-3');

    contactCard.addEventListener('mousemove', (e) => {
      const rect = contactCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      contactCard.style.setProperty('--mouse-x', `${x}px`);
      contactCard.style.setProperty('--mouse-y', `${y}px`);

      const dx = (x / rect.width) - 0.5;
      const dy = (y / rect.height) - 0.5;
      
      // Dynamic mouse tracking parallax shift for floating bubbles
      if (p1) p1.style.transform = `translate3d(${dx * 20}px, ${dy * 20}px, 0)`;
      if (p2) p2.style.transform = `translate3d(${dx * -30}px, ${dy * -30}px, 0)`;
      if (p3) p3.style.transform = `translate3d(${dx * 15}px, ${dy * 15}px, 0)`;
    }, { passive: true });

    contactCard.addEventListener('mouseleave', () => {
      const resetTransition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      if (p1) { p1.style.transition = resetTransition; p1.style.transform = 'translate3d(0, 0, 0)'; }
      if (p2) { p2.style.transition = resetTransition; p2.style.transform = 'translate3d(0, 0, 0)'; }
      if (p3) { p3.style.transition = resetTransition; p3.style.transform = 'translate3d(0, 0, 0)'; }
      
      setTimeout(() => {
        if (p1) p1.style.transition = '';
        if (p2) p2.style.transition = '';
        if (p3) p3.style.transition = '';
      }, 600);
    });
  }

});
