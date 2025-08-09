// Doomsday Planner - Enhanced Survival System
class DoomsdayPlanner {
    constructor() {
        this.currentScenario = null;
        this.survivalData = {};
        this.supplies = {};
        this.contacts = [];
        this.location = null;
        this.soundEnabled = true;
        this.isOffline = false;
        
        this.initializeApp();
        this.loadSavedData();
        this.setupEventListeners();
        this.startBackgroundEffects();
        this.updateDateTime();
        this.registerServiceWorker();
    }

    // Initialize the application
    initializeApp() {
        console.log('🌍 Doomsday Planner v2.0 Initialized');
        this.showToast('Welcome to Doomsday Planner v2.0!', 'success');
        this.updateConnectionStatus();
        this.calculateSupplies();
        this.loadDailyDoom();
        
        // Check for PWA installation
        this.checkPWAInstallation();
    }

    // Load saved data from localStorage
    loadSavedData() {
        try {
            const savedSupplies = localStorage.getItem('doomsday_supplies');
            if (savedSupplies) {
                this.supplies = JSON.parse(savedSupplies);
            }

            const savedContacts = localStorage.getItem('doomsday_contacts');
            if (savedContacts) {
                this.contacts = JSON.parse(savedContacts);
                this.renderContacts();
            }

            const savedPreferences = localStorage.getItem('doomsday_preferences');
            if (savedPreferences) {
                const prefs = JSON.parse(savedPreferences);
                this.soundEnabled = prefs.soundEnabled !== false;
                this.updateSoundIcon();
            }

            const savedLocation = localStorage.getItem('doomsday_location');
            if (savedLocation) {
                this.location = JSON.parse(savedLocation);
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    // Save data to localStorage
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showToast('Failed to save data', 'error');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Window events
        window.addEventListener('online', () => {
            this.isOffline = false;
            this.updateConnectionStatus();
            this.showToast('Connection restored!', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOffline = true;
            this.updateConnectionStatus();
            this.showToast('You are now offline', 'warning');
        });

        // Supply checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('supply-checkbox')) {
                this.updateSupplyProgress();
            }
        });

        // Family size and duration changes
        const familySizeInput = document.getElementById('familySize');
        const durationInput = document.getElementById('duration');
        
        if (familySizeInput) {
            familySizeInput.addEventListener('change', () => this.calculateSupplies());
        }
        if (durationInput) {
            durationInput.addEventListener('change', () => this.calculateSupplies());
        }

        // Location input
        const locationInput = document.getElementById('locationInput');
        if (locationInput) {
            locationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.analyzeLocation();
                }
            });
        }

        // Guide search
        const guideSearch = document.getElementById('guideSearch');
        if (guideSearch) {
            guideSearch.addEventListener('input', (e) => {
                this.filterGuides(e.target.value);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.switchTab('scenarios');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchTab('supplies');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchTab('location');
                        break;
                    case '4':
                        e.preventDefault();
                        this.switchTab('contacts');
                        break;
                    case '5':
                        e.preventDefault();
                        this.switchTab('guides');
                        break;
                    case 'g':
                        e.preventDefault();
                        this.generateScenario();
                        break;
                }
            }
        });
    }

    // Switch between tabs
    switchTab(tabName) {
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected tab and button
        const selectedTab = document.getElementById(tabName);
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (selectedTab && selectedBtn) {
            selectedTab.classList.add('active');
            selectedBtn.classList.add('active');
        }

        // Tab-specific actions
        switch (tabName) {
            case 'supplies':
                this.calculateSupplies();
                break;
            case 'contacts':
                this.renderContacts();
                break;
        }
    }

    // Start background effects
    startBackgroundEffects() {
        this.createParticles();
        this.createMeteors();
        
        // Periodic effects
        setInterval(() => {
            this.createMeteors();
        }, 5000);

        setInterval(() => {
            this.glitchEffect();
        }, 30000);
    }

    // Create floating particles
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Create meteors
    createMeteors() {
        const meteorsContainer = document.getElementById('meteors');
        const meteorCount = 3;

        for (let i = 0; i < meteorCount; i++) {
            const meteor = document.createElement('div');
            meteor.className = 'meteor';
            meteor.style.left = Math.random() * 100 + '%';
            meteor.style.animationDelay = Math.random() * 2 + 's';
            meteorsContainer.appendChild(meteor);

            // Remove meteor after animation
            setTimeout(() => {
                if (meteor.parentNode) {
                    meteor.parentNode.removeChild(meteor);
                }
            }, 4000);
        }
    }

    // Glitch effect
    glitchEffect() {
        const header = document.getElementById('mainHeader');
        header.classList.add('shake');
        setTimeout(() => {
            header.classList.remove('shake');
        }, 500);
    }

    // Update date and time
    updateDateTime() {
        const currentDate = document.getElementById('currentDate');
        if (currentDate) {
            const now = new Date();
            currentDate.textContent = now.toLocaleDateString();
        }
        
        setTimeout(() => this.updateDateTime(), 60000); // Update every minute
    }

    // Update connection status
    updateConnectionStatus() {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = this.isOffline ? 'OFFLINE' : 'ONLINE';
            statusElement.style.color = this.isOffline ? '#e74c3c' : '#4ecdc4';
        }
    }

    // Generate a new scenario
    generateScenario() {
        this.showLoading(true);
        
        setTimeout(() => {
            const difficulty = document.getElementById('difficulty').value;
            const scenario = this.getRandomScenario(difficulty);
            this.currentScenario = scenario;
            this.displayScenario(scenario);
            this.analyzeSurvival(scenario);
            this.showLoading(false);
            this.playSound('notification');
        }, 1500);
    }

    // Get random scenario based on difficulty
    getRandomScenario(difficulty) {
        const scenarios = {
            easy: [
                {
                    title: "Mild Food Shortage",
                    description: "Local grocery stores experience supply chain delays. Limited food availability for 1-2 weeks.",
                    threat: "low",
                    tips: [
                        "Check your pantry inventory",
                        "Visit multiple stores for supplies",
                        "Consider community food sharing",
                        "Preserve perishable foods"
                    ]
                },
                {
                    title: "Extended Power Outage",
                    description: "Severe storm causes regional power grid failure. Electricity may be out for 3-7 days.",
                    threat: "low",
                    tips: [
                        "Use flashlights instead of candles",
                        "Keep refrigerator and freezer doors closed",
                        "Use battery-powered or hand crank radio",
                        "Charge devices with car charger"
                    ]
                }
            ],
            medium: [
                {
                    title: "Category 3 Hurricane",
                    description: "Major hurricane approaching with 120mph winds. Mandatory evacuation orders issued.",
                    threat: "medium",
                    tips: [
                        "Follow evacuation routes immediately",
                        "Secure or remove outdoor objects",
                        "Fill bathtubs and containers with water",
                        "Prepare for 2-week self-sufficiency"
                    ]
                },
                {
                    title: "Regional Earthquake",
                    description: "7.2 magnitude earthquake damages infrastructure. Aftershocks expected for weeks.",
                    threat: "medium",
                    tips: [
                        "Drop, cover, and hold during aftershocks",
                        "Check for gas leaks and structural damage",
                        "Avoid damaged buildings and bridges",
                        "Prepare for limited emergency services"
                    ]
                }
            ],
            hard: [
                {
                    title: "Volcanic Eruption",
                    description: "Supervolcano eruption causes global climate disruption and ash clouds covering thousands of miles.",
                    threat: "high",
                    tips: [
                        "Seal all openings to prevent ash infiltration",
                        "Wear N95 masks or better when outside",
                        "Stock water filtration systems",
                        "Prepare for long-term food shortages"
                    ]
                },
                {
                    title: "Grid-Wide Cyber Attack",
                    description: "Coordinated cyber attack shuts down power grids, communication networks, and financial systems.",
                    threat: "high",
                    tips: [
                        "Keep cash on hand for transactions",
                        "Use ham radio for communication",
                        "Maintain manual backup systems",
                        "Form local community networks"
                    ]
                }
            ],
            nightmare: [
                {
                    title: "Asteroid Impact",
                    description: "6-mile diameter asteroid impact causes nuclear winter conditions and global civilization collapse.",
                    threat: "extreme",
                    tips: [
                        "Seek underground shelter immediately",
                        "Stock minimum 5 years of supplies",
                        "Establish sustainable food production",
                        "Form survival community alliances"
                    ]
                },
                {
                    title: "AI Singularity Event",
                    description: "Artificial General Intelligence achieves superintelligence and views humanity as a threat to eliminate.",
                    threat: "extreme",
                    tips: [
                        "Avoid all electronic devices and networks",
                        "Seek remote locations without infrastructure",
                        "Use only analog tools and equipment",
                        "Establish off-grid communities"
                    ]
                }
            ]
        };

        const difficultyScenarios = scenarios[difficulty] || scenarios.medium;
        return difficultyScenarios[Math.floor(Math.random() * difficultyScenarios.length)];
    }

    // Display scenario
    displayScenario(scenario) {
        const display = document.getElementById('scenarioDisplay');
        const analysisSection = document.getElementById('survivalAnalysis');
        
        display.innerHTML = `
            <div class="scenario-content">
                <div class="scenario-title">${scenario.title}</div>
                <div class="scenario-description">${scenario.description}</div>
                <div class="threat-indicator threat-${scenario.threat}">
                    Threat Level: ${scenario.threat.toUpperCase()}
                </div>
            </div>
        `;

        analysisSection.style.display = 'block';
    }

    // Analyze survival chances
    analyzeSurvival(scenario) {
        const preparationLevel = this.calculatePreparationLevel();
        const locationSafety = this.calculateLocationSafety();
        const resourceAccess = this.calculateResourceAccess();

        const overallSurvival = Math.round((preparationLevel + locationSafety + resourceAccess) / 3);

        // Update survival meter
        const meter = document.getElementById('survivalMeter');
        const percentage = document.getElementById('survivalPercentage');
        
        if (meter && percentage) {
            percentage.textContent = overallSurvival;
            meter.style.background = `conic-gradient(
                var(--primary-color) 0deg,
                var(--primary-color) ${overallSurvival * 3.6}deg,
                rgba(255, 255, 255, 0.1) ${overallSurvival * 3.6}deg
            )`;
        }

        // Update factor bars
        this.updateFactorBar('preparationFactor', preparationLevel);
        this.updateFactorBar('locationFactor', locationSafety);
        this.updateFactorBar('resourceFactor', resourceAccess);

        // Generate protocol steps
        this.generateProtocolSteps(scenario);
    }

    // Calculate preparation level
    calculatePreparationLevel() {
        const totalSupplies = this.getTotalSuppliesNeeded();
        const checkedSupplies = this.getCheckedSuppliesCount();
        return Math.min(100, Math.round((checkedSupplies / totalSupplies) * 100));
    }

    // Calculate location safety
    calculateLocationSafety() {
        // This would integrate with real location APIs
        return Math.floor(Math.random() * 40) + 60; // 60-100% for demo
    }

    // Calculate resource access
    calculateResourceAccess() {
        const familySize = parseInt(document.getElementById('familySize').value) || 2;
        const duration = parseInt(document.getElementById('duration').value) || 14;
        
        // Base score inversely related to family size and duration
        let score = 100 - (familySize * 5) - (duration * 2);
        return Math.max(20, Math.min(100, score));
    }

    // Update factor bar
    updateFactorBar(elementId, percentage) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.width = percentage + '%';
        }
    }

    // Generate protocol steps
    generateProtocolSteps(scenario) {
        const stepsContainer = document.getElementById('protocolSteps');
        if (!stepsContainer) return;

        const steps = scenario.tips.map((tip, index) => `
            <div class="protocol-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <h4>Step ${index + 1}</h4>
                    <p>${tip}</p>
                </div>
            </div>
        `).join('');

        stepsContainer.innerHTML = steps;
    }

    // Generate custom scenario
    generateCustomScenario() {
        const input = document.getElementById('customScenario');
        const scenario = input.value.trim();
        
        if (!scenario) {
            this.showToast('Please enter a scenario description', 'warning');
            return;
        }

        this.showLoading(true);
        
        setTimeout(() => {
            const customScenario = {
                title: "Custom Scenario",
                description: scenario,
                threat: "medium",
                tips: this.generateCustomTips(scenario)
            };
            
            this.currentScenario = customScenario;
            this.displayScenario(customScenario);
            this.analyzeSurvival(customScenario);
            this.showLoading(false);
            input.value = '';
        }, 1000);
    }

    // Generate custom tips based on scenario
    generateCustomTips(scenario) {
        const keywords = scenario.toLowerCase();
        const tips = [];

        if (keywords.includes('water') || keywords.includes('flood')) {
            tips.push("Secure clean water sources and purification methods");
            tips.push("Move to higher ground immediately");
        }
        
        if (keywords.includes('fire') || keywords.includes('burn')) {
            tips.push("Create defensible space around shelter");
            tips.push("Have multiple evacuation routes planned");
        }
        
        if (keywords.includes('cold') || keywords.includes('winter')) {
            tips.push("Insulate shelter and conserve body heat");
            tips.push("Stock extra heating fuel and warm clothing");
        }
        
        if (keywords.includes('food') || keywords.includes('hunger')) {
            tips.push("Ration existing food supplies carefully");
            tips.push("Learn local foraging and fishing techniques");
        }

        // Default tips if no keywords match
        if (tips.length === 0) {
            tips.push("Assess immediate threats and prioritize safety");
            tips.push("Secure basic needs: water, food, shelter");
            tips.push("Establish communication with others");
            tips.push("Create short and long-term survival plans");
        }

        return tips;
    }

    // Use template scenario
    useTemplate(template) {
        const templates = {
            zombie: "Global zombie outbreak spreading rapidly through major cities",
            nuclear: "Nuclear power plant meltdown creating radiation exclusion zone",
            asteroid: "Large asteroid on collision course with Earth in 30 days",
            pandemic: "Highly contagious virus with 15% mortality rate spreading globally",
            ai: "AI systems become self-aware and hostile to human existence"
        };

        const input = document.getElementById('customScenario');
        input.value = templates[template] || '';
        input.focus();
    }

    // Generate daily doom scenario
    generateDailyDoom() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        
        // Use day of year as seed for consistent daily scenario
        const scenarios = [
            "Minor internet outage affecting social media platforms",
            "Local coffee shop runs out of your favorite blend",
            "Traffic lights malfunction during rush hour",
            "Grocery store temporarily closes due to staff shortage",
            "Cell tower maintenance causes spotty coverage",
            "Water main break affects neighborhood supply",
            "Power substation maintenance causes rolling blackouts",
            "Severe weather warning issued for your area"
        ];

        const scenarioIndex = dayOfYear % scenarios.length;
        const scenario = scenarios[scenarioIndex];
        
        this.showToast(`Today's Doomsday: ${scenario}`, 'warning');
    }

    // Escalate current scenario
    escalateScenario() {
        if (!this.currentScenario) {
            this.showToast('Generate a scenario first!', 'warning');
            return;
        }

        const escalations = [
            "Situation has worsened: Supply lines completely cut off",
            "Critical update: Emergency services overwhelmed and unavailable",
            "Breaking: Communication networks failing across the region",
            "Alert: Multiple simultaneous disasters reported",
            "Warning: Government declares martial law in affected areas"
        ];

        const escalation = escalations[Math.floor(Math.random() * escalations.length)];
        this.showToast(escalation, 'error');
        
        // Reduce survival chances
        const currentPercentage = parseInt(document.getElementById('survivalPercentage').textContent);
        const newPercentage = Math.max(5, currentPercentage - 20);
        document.getElementById('survivalPercentage').textContent = newPercentage;
        
        this.playSound('alert');
    }

    // Calculate supplies based on family size and duration
    calculateSupplies() {
        const familySize = parseInt(document.getElementById('familySize').value) || 2;
        const duration = parseInt(document.getElementById('duration').value) || 14;

        const suppliesData = {
            food: [
                { name: "Water (gallons)", quantity: familySize * duration, unit: "gallons" },
                { name: "Non-perishable meals", quantity: familySize * duration * 3, unit: "meals" },
                { name: "Canned goods", quantity: familySize * 20, unit: "cans" },
                { name: "Energy bars", quantity: familySize * 10, unit: "bars" },
                { name: "Dried fruits/nuts", quantity: familySize * 5, unit: "lbs" }
            ],
            medical: [
                { name: "First aid kit", quantity: 1, unit: "kit" },
                { name: "Prescription medications", quantity: duration, unit: "days supply" },
                { name: "Pain relievers", quantity: 2, unit: "bottles" },
                { name: "Bandages", quantity: 20, unit: "count" },
                { name: "Antiseptic", quantity: 3, unit: "bottles" }
            ],
            tools: [
                { name: "Flashlights", quantity: familySize, unit: "count" },
                { name: "Batteries (various)", quantity: 20, unit: "count" },
                { name: "Multi-tool", quantity: 2, unit: "count" },
                { name: "Duct tape", quantity: 3, unit: "rolls" },
                { name: "Rope", quantity: 100, unit: "feet" }
            ],
            shelter: [
                { name: "Emergency blankets", quantity: familySize * 2, unit: "count" },
                { name: "Sleeping bags", quantity: familySize, unit: "count" },
                { name: "Tarps", quantity: 2, unit: "count" },
                { name: "Warm clothing sets", quantity: familySize, unit: "sets" },
                { name: "Rain gear", quantity: familySize, unit: "sets" }
            ]
        };

        // Render supplies for each category
        Object.keys(suppliesData).forEach(category => {
            this.renderSupplyCategory(category, suppliesData[category]);
        });

        this.updateSupplyProgress();
    }

    // Render supply category
    renderSupplyCategory(category, supplies) {
        const container = document.getElementById(`${category}Supplies`);
        if (!container) return;

        container.innerHTML = supplies.map(supply => `
            <div class="supply-item">
                <div class="supply-info">
                    <div class="supply-name">${supply.name}</div>
                    <div class="supply-quantity">Need: ${supply.quantity} ${supply.unit}</div>
                </div>
                <input type="checkbox" class="supply-checkbox" data-category="${category}" 
                       ${this.supplies[`${category}_${supply.name}`] ? 'checked' : ''}>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.supply-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const key = `${category}_${e.target.closest('.supply-item').querySelector('.supply-name').textContent}`;
                this.supplies[key] = e.target.checked;
                this.saveData('doomsday_supplies', this.supplies);
                this.updateSupplyProgress();
            });
        });
    }

    // Update supply progress
    updateSupplyProgress() {
        const categories = ['food', 'medical', 'tools', 'shelter'];
        
        categories.forEach(category => {
            const checkboxes = document.querySelectorAll(`[data-category="${category}"]`);
            const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
            const total = checkboxes.length;
            const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
            
            const progressElement = document.getElementById(`${category}Progress`);
            if (progressElement) {
                progressElement.textContent = `${percentage}%`;
                progressElement.style.color = percentage >= 80 ? '#4ecdc4' : percentage >= 50 ? '#ffd93d' : '#ff6b6b';
            }
        });
    }

    // Get total supplies needed
    getTotalSuppliesNeeded() {
        return document.querySelectorAll('.supply-checkbox').length;
    }

    // Get checked supplies count
    getCheckedSuppliesCount() {
        return document.querySelectorAll('.supply-checkbox:checked').length;
    }

    // Export supply list
    exportSupplyList() {
        const checkedSupplies = [];
        const uncheckedSupplies = [];
        
        document.querySelectorAll('.supply-item').forEach(item => {
            const name = item.querySelector('.supply-name').textContent;
            const quantity = item.querySelector('.supply-quantity').textContent;
            const checkbox = item.querySelector('.supply-checkbox');
            
            const supply = `${name} - ${quantity}`;
            if (checkbox.checked) {
                checkedSupplies.push(`✓ ${supply}`);
            } else {
                uncheckedSupplies.push(`○ ${supply}`);
            }
        });

        const content = `DOOMSDAY PLANNER - SUPPLY LIST\n\nCOMPLETED:\n${checkedSupplies.join('\n')}\n\nNEEDED:\n${uncheckedSupplies.join('\n')}`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'doomsday-supplies.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Supply list exported!', 'success');
    }

    // Reset supplies
    resetSupplies() {
        if (confirm('Reset all supply checkboxes?')) {
            this.supplies = {};
            this.saveData('doomsday_supplies', this.supplies);
            document.querySelectorAll('.supply-checkbox').forEach(cb => cb.checked = false);
            this.updateSupplyProgress();
            this.showToast('Supplies reset!', 'success');
        }
    }

    // Get current location
    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showToast('Geolocation not supported', 'error');
            return;
        }

        this.showLoading(true);
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.location = { latitude, longitude };
                this.saveData('doomsday_location', this.location);
                
                document.getElementById('locationInput').value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                this.analyzeLocation();
                this.showLoading(false);
            },
            (error) => {
                this.showToast('Failed to get location', 'error');
                this.showLoading(false);
            }
        );
    }

    // Analyze location
    analyzeLocation() {
        const input = document.getElementById('locationInput').value.trim();
        if (!input) {
            this.showToast('Please enter a location', 'warning');
            return;
        }

        this.showLoading(true);
        
        setTimeout(() => {
            // Simulate location analysis
            const locationInfo = document.getElementById('locationInfo');
            const coordinatesText = document.getElementById('coordinatesText');
            const currentLocationText = document.getElementById('currentLocationText');
            
            if (locationInfo && coordinatesText && currentLocationText) {
                locationInfo.style.display = 'block';
                currentLocationText.textContent = input;
                coordinatesText.textContent = input.includes(',') ? input : 'Location processed';
            }

            // Update risk assessments
            this.updateRiskAssessments();
            this.generateSafeZones();
            
            this.showLoading(false);
            this.showToast('Location analyzed!', 'success');
        }, 1500);
    }

    // Update risk assessments
    updateRiskAssessments() {
        const risks = {
            natural: Math.floor(Math.random() * 40) + 30,
            population: Math.floor(Math.random() * 50) + 25,
            infrastructure: Math.floor(Math.random() * 60) + 20
        };

        Object.keys(risks).forEach(risk => {
            const fillElement = document.getElementById(`${risk}Risk`);
            const levelElement = document.getElementById(`${risk}Level`);
            
            if (fillElement && levelElement) {
                const percentage = risks[risk];
                fillElement.style.width = percentage + '%';
                fillElement.style.background = this.getRiskColor(percentage);
                
                let level = 'Low';
                if (percentage > 70) level = 'High';
                else if (percentage > 40) level = 'Medium';
                
                levelElement.textContent = level;
                levelElement.style.color = this.getRiskColor(percentage);
            }
        });
    }

    // Get risk color based on percentage
    getRiskColor(percentage) {
        if (percentage > 70) return '#e74c3c';
        if (percentage > 40) return '#ffd93d';
        return '#4ecdc4';
    }

    // Generate safe zones
    generateSafeZones() {
        const safeZones = [
            { name: "Community Center", distance: "0.8 miles", capacity: "500 people" },
            { name: "High School Gymnasium", distance: "1.2 miles", capacity: "300 people" },
            { name: "Public Library", distance: "0.5 miles", capacity: "150 people" },
            { name: "Fire Station", distance: "2.1 miles", capacity: "50 people" }
        ];

        const container = document.getElementById('safeZoneList');
        if (container) {
            container.innerHTML = safeZones.map(zone => `
                <div class="safe-zone">
                    <h4>${zone.name}</h4>
                    <p>Distance: ${zone.distance}</p>
                    <p>Capacity: ${zone.capacity}</p>
                </div>
            `).join('');
        }
    }

    // Plan evacuation route
    planRoute(direction) {
        const routeInfo = document.getElementById('routeInfo');
        if (!routeInfo) return;

        const routes = {
            north: "Highway 101 North - Clear roads, 45 miles to safety zone",
            south: "Interstate 5 South - Heavy traffic expected, 38 miles to safety zone",
            east: "Route 99 East - Mountain pass, 52 miles to safety zone",
            west: "Coastal Highway West - Flood risk, 41 miles to safety zone"
        };

        routeInfo.innerHTML = `
            <h4>Recommended ${direction.toUpperCase()} Route:</h4>
            <p>${routes[direction]}</p>
            <button class="btn secondary-btn" onclick="this.downloadRoute('${direction}')">
                <i class="fas fa-download"></i> Download Route
            </button>
        `;

        this.showToast(`${direction.toUpperCase()} route planned!`, 'success');
    }

    // Add contact
    addContact() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Save contact
    saveContact() {
        const name = document.getElementById('contactName').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const relation = document.getElementById('contactRelation').value;
        const isPrimary = document.getElementById('contactPrimary').checked;

        if (!name || !phone) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        const contact = {
            id: Date.now(),
            name,
            phone,
            relation,
            isPrimary
        };

        this.contacts.push(contact);
        this.saveData('doomsday_contacts', this.contacts);
        this.renderContacts();
        this.closeModal('contactModal');
        this.showToast('Contact added!', 'success');

        // Clear form
        document.getElementById('contactName').value = '';
        document.getElementById('contactPhone').value = '';
        document.getElementById('contactPrimary').checked = false;
    }

    // Render contacts
    renderContacts() {
        const container = document.getElementById('contactList');
        if (!container) return;

        if (this.contacts.length === 0) {
            container.innerHTML = `
                <div class="no-contacts">
                    <i class="fas fa-user-friends"></i>
                    <p>No emergency contacts added yet</p>
                    <button class="btn secondary-btn" onclick="doomsdayPlanner.addContact()">Add First Contact</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.contacts.map(contact => `
            <div class="contact-item">
                <div class="contact-info">
                    <h4>${contact.name} ${contact.isPrimary ? '⭐' : ''}</h4>
                    <p>${contact.phone} • ${contact.relation}</p>
                </div>
                <div class="contact-actions">
                    <button class="btn secondary-btn" onclick="doomsdayPlanner.callContact('${contact.phone}')">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="btn danger-btn" onclick="doomsdayPlanner.deleteContact(${contact.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Call contact
    callContact(phone) {
        if (confirm(`Call ${phone}?`)) {
            window.open(`tel:${phone}`);
        }
    }

    // Delete contact
    deleteContact(id) {
        if (confirm('Delete this contact?')) {
            this.contacts = this.contacts.filter(contact => contact.id !== id);
            this.saveData('doomsday_contacts', this.contacts);
            this.renderContacts();
            this.showToast('Contact deleted!', 'success');
        }
    }

    // Call emergency services
    callEmergency(type) {
        const numbers = {
            '911': '911',
            'fire': '911',
            'medical': '1-800-222-1222',
            'police': '311'
        };

        const number = numbers[type];
        if (confirm(`Call ${number}?`)) {
            window.open(`tel:${number}`);
        }
    }

    // Open survival guide
    openGuide(guideType) {
        const modal = document.getElementById('guideModal');
        const title = document.getElementById('guideTitle');
        const content = document.getElementById('guideContent');

        if (!modal || !title || !content) return;

        const guides = this.getGuideContent(guideType);
        title.innerHTML = `<i class="fas fa-book-open"></i> ${guides.title}`;
        content.innerHTML = guides.content;

        modal.classList.add('active');
    }

    // Get guide content
    getGuideContent(type) {
        const guides = {
            basic: {
                title: "Basic Survival Guide",
                content: `
                    <h4>The Rule of Threes</h4>
                    <ul>
                        <li>3 minutes without air</li>
                        <li>3 hours without shelter in extreme conditions</li>
                        <li>3 days without water</li>
                        <li>3 weeks without food</li>
                    </ul>
                    
                    <h4>Survival Priorities</h4>
                    <ol>
                        <li><strong>Safety:</strong> Remove yourself from immediate danger</li>
                        <li><strong>Shelter:</strong> Protect from elements</li>
                        <li><strong>Water:</strong> Find and purify drinking water</li>
                        <li><strong>Fire:</strong> Warmth, cooking, signaling</li>
                        <li><strong>Food:</strong> Sustenance for energy</li>
                        <li><strong>Rescue:</strong> Signal for help</li>
                    </ol>
                    
                    <div class="warning">
                        <strong>Warning:</strong> Never drink untreated water from unknown sources. Always purify first.
                    </div>
                `
            },
            water: {
                title: "Water Procurement Guide",
                content: `
                    <h4>Finding Water Sources</h4>
                    <ul>
                        <li>Morning dew on plants and grass</li>
                        <li>Rainwater collection</li>
                        <li>Underground springs</li>
                        <li>Tree wells and rock crevices</li>
                        <li>Following animal tracks to water</li>
                    </ul>
                    
                    <h4>Purification Methods</h4>
                    <ol>
                        <li><strong>Boiling:</strong> 1 minute at sea level, 3 minutes above 6,500 feet</li>
                        <li><strong>Water purification tablets:</strong> Follow package instructions</li>
                        <li><strong>UV sterilization:</strong> Clear water in clear container, 6 hours direct sunlight</li>
                        <li><strong>Filtration:</strong> Cloth, sand, charcoal layers</li>
                    </ol>
                    
                    <div class="tip">
                        <strong>Tip:</strong> Clear water isn't always safe. Even clear mountain streams can contain harmful parasites.
                    </div>
                `
            },
            shelter: {
                title: "Shelter Building Guide",
                content: `
                    <h4>Location Selection</h4>
                    <ul>
                        <li>Dry ground, slightly elevated</li>
                        <li>Protected from wind</li>
                        <li>Away from dead trees or loose rocks</li>
                        <li>Near water source but not in flood zone</li>
                        <li>Insulated from ground cold</li>
                    </ul>
                    
                    <h4>Basic Lean-To Construction</h4>
                    <ol>
                        <li>Find or create a ridge pole</li>
                        <li>Secure between two trees or supports</li>
                        <li>Lean branches against ridge pole</li>
                        <li>Add smaller branches and debris</li>
                        <li>Create insulation layer</li>
                    </ol>
                    
                    <div class="warning">
                        <strong>Warning:</strong> Your shelter should be just big enough for you. Larger spaces are harder to heat.
                    </div>
                `
            },
            fire: {
                title: "Fire Starting Guide",
                content: `
                    <h4>Fire Triangle Requirements</h4>
                    <ul>
                        <li><strong>Heat:</strong> Spark or flame to ignite</li>
                        <li><strong>Fuel:</strong> Combustible material</li>
                        <li><strong>Oxygen:</strong> Air flow for combustion</li>
                    </ul>
                    
                    <h4>Tinder Materials</h4>
                    <ul>
                        <li>Dry grass and leaves</li>
                        <li>Birch bark</li>
                        <li>Pine needles</li>
                        <li>Paper or cloth</li>
                        <li>Steel wool</li>
                    </ul>
                    
                    <h4>Fire Building Steps</h4>
                    <ol>
                        <li>Prepare tinder nest</li>
                        <li>Gather kindling (pencil to thumb thickness)</li>
                        <li>Collect fuel wood (thumb to wrist thickness)</li>
                        <li>Light tinder</li>
                        <li>Add kindling gradually</li>
                        <li>Add fuel wood as fire grows</li>
                    </ol>
                `
            },
            food: {
                title: "Food Procurement Guide",
                content: `
                    <h4>Edible Plants (Common)</h4>
                    <ul>
                        <li>Dandelions (entire plant)</li>
                        <li>Plantain (leaves and seeds)</li>
                        <li>Clover (flowers and leaves)</li>
                        <li>Acorns (process to remove tannins)</li>
                        <li>Wild berries (know your local varieties)</li>
                    </ul>
                    
                    <h4>Universal Edibility Test</h4>
                    <ol>
                        <li>Avoid mushrooms and unknown berries</li>
                        <li>Smell for strong or acid odors</li>
                        <li>Place on inside of wrist for 15 minutes</li>
                        <li>Touch to corner of mouth for 3 minutes</li>
                        <li>Touch to tongue tip for 15 minutes</li>
                        <li>Chew and hold in mouth for 15 minutes</li>
                        <li>Swallow small amount and wait 8 hours</li>
                    </ol>
                    
                    <div class="warning">
                        <strong>Warning:</strong> When in doubt, don't eat it. Many plants can be toxic or deadly.
                    </div>
                `
            },
            medical: {
                title: "First Aid Guide",
                content: `
                    <h4>Primary Assessment (ABCs)</h4>
                    <ul>
                        <li><strong>Airway:</strong> Is it clear and open?</li>
                        <li><strong>Breathing:</strong> Is the person breathing?</li>
                        <li><strong>Circulation:</strong> Is there a pulse? Severe bleeding?</li>
                    </ul>
                    
                    <h4>Bleeding Control</h4>
                    <ol>
                        <li>Apply direct pressure with clean cloth</li>
                        <li>Elevate injury above heart if possible</li>
                        <li>Apply pressure to pressure points if needed</li>
                        <li>Use tourniquet only as last resort</li>
                    </ol>
                    
                    <h4>Shock Treatment</h4>
                    <ul>
                        <li>Keep person lying down and warm</li>
                        <li>Elevate legs 12 inches if no spinal injury</li>
                        <li>Loosen tight clothing</li>
                        <li>Monitor breathing and pulse</li>
                    </ul>
                    
                    <div class="warning">
                        <strong>Emergency:</strong> Call 911 immediately for serious injuries. These are basic guidelines only.
                    </div>
                `
            }
        };

        return guides[type] || guides.basic;
    }

    // Filter guides
    filterGuides(searchTerm) {
        const guides = document.querySelectorAll('.guide-category');
        const term = searchTerm.toLowerCase();

        guides.forEach(guide => {
            const title = guide.querySelector('h3').textContent.toLowerCase();
            const description = guide.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(term) || description.includes(term)) {
                guide.style.display = 'block';
            } else {
                guide.style.display = 'none';
            }
        });
    }

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Toggle FAB menu
    toggleFabMenu() {
        const menu = document.getElementById('fabMenu');
        if (menu) {
            menu.classList.toggle('active');
        }
    }

    // Toggle sound
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.updateSoundIcon();
        this.saveData('doomsday_preferences', { soundEnabled: this.soundEnabled });
        this.showToast(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`, 'success');
    }

    // Update sound icon
    updateSoundIcon() {
        const icon = document.getElementById('soundIcon');
        if (icon) {
            icon.className = this.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
    }

    // Play sound
    playSound(type) {
        if (!this.soundEnabled) return;

        // Create audio context for web audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const frequencies = {
            notification: 800,
            alert: 1000,
            success: 600,
            error: 400
        };

        oscillator.frequency.setValueAtTime(frequencies[type] || 800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Toggle fullscreen
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                this.showToast('Cannot enter fullscreen mode', 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Share app
    shareApp() {
        if (navigator.share) {
            navigator.share({
                title: 'Doomsday Planner',
                text: 'Ultimate Emergency Preparedness System',
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showToast('Link copied to clipboard!', 'success');
            });
        }
    }

    // Install app (PWA)
    installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    this.showToast('App installed successfully!', 'success');
                }
                this.deferredPrompt = null;
            });
        } else {
            this.showToast('Installation not available', 'warning');
        }
    }

    // Check PWA installation
    checkPWAInstallation() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });

        window.addEventListener('appinstalled', () => {
            this.showToast('App installed successfully!', 'success');
            this.deferredPrompt = null;
        });
    }

    // Register service worker
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    // Show loading overlay
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('active', show);
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation' : 'info';
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);

        // Remove on click
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    // Load daily doom scenario
    loadDailyDoom() {
        // This could integrate with weather/news APIs
        const today = new Date();
        const scenarios = [
            "Increased solar activity may disrupt communications",
            "Seasonal flu outbreak in nearby regions",
            "Supply chain delays affecting local stores",
            "Weather patterns indicate potential severe storms",
            "Elevated cosmic radiation levels detected",
            "Minor seismic activity reported in the region"
        ];

        const scenarioIndex = today.getDate() % scenarios.length;
        const doomText = document.getElementById('dailyDoomText');
        if (doomText) {
            doomText.textContent = scenarios[scenarioIndex];
        }
    }
}

// Global functions for HTML onclick handlers
function generateScenario() {
    doomsdayPlanner.generateScenario();
}

function generateDailyDoom() {
    doomsdayPlanner.generateDailyDoom();
}

function escalateScenario() {
    doomsdayPlanner.escalateScenario();
}

function generateCustomScenario() {
    doomsdayPlanner.generateCustomScenario();
}

function useTemplate(template) {
    doomsdayPlanner.useTemplate(template);
}

function calculateSupplies() {
    doomsdayPlanner.calculateSupplies();
}

function exportSupplyList() {
    doomsdayPlanner.exportSupplyList();
}

function resetSupplies() {
    doomsdayPlanner.resetSupplies();
}

function getCurrentLocation() {
    doomsdayPlanner.getCurrentLocation();
}

function analyzeLocation() {
    doomsdayPlanner.analyzeLocation();
}

function planRoute(direction) {
    doomsdayPlanner.planRoute(direction);
}

function addContact() {
    doomsdayPlanner.addContact();
}

function saveContact() {
    doomsdayPlanner.saveContact();
}

function callEmergency(type) {
    doomsdayPlanner.callEmergency(type);
}

function openGuide(guideType) {
    doomsdayPlanner.openGuide(guideType);
}

function closeModal(modalId) {
    doomsdayPlanner.closeModal(modalId);
}

function toggleFabMenu() {
    doomsdayPlanner.toggleFabMenu();
}

function toggleSound() {
    doomsdayPlanner.toggleSound();
}

function toggleFullscreen() {
    doomsdayPlanner.toggleFullscreen();
}

function shareApp() {
    doomsdayPlanner.shareApp();
}

function installApp() {
    doomsdayPlanner.installApp();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.doomsdayPlanner = new DoomsdayPlanner();
});

// Handle clicks outside modals to close them
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Handle escape key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
