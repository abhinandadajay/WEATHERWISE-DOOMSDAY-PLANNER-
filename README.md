# WEATHERWISE-DOOMSDAY-PLANNER-
ULTIMATE SURVIVAL SYSTEM 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doomsday Planner - Ultimate Survival System</title>
    <meta name="description" content="Advanced emergency preparedness and survival planning system">
    <meta name="theme-color" content="#1a1a2e">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="manifest.json">
    
    <!-- Icons -->
    <link rel="apple-touch-icon" href="icons/icon-192.png">
    <link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
    
    <!-- External Dependencies -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Background Effects -->
    <div class="background-effects" id="backgroundEffects">
        <div class="particles" id="particles"></div>
        <div class="meteors" id="meteors"></div>
        <div class="glitch-overlay" id="glitchOverlay"></div>
    </div>
    
    <!-- Audio Elements -->
    <audio id="ambientSound" loop>
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav">
    </audio>
    
    <!-- Header -->
    <header class="header" id="mainHeader">
        <div class="header-content">
            <div class="logo-container">
                <i class="fas fa-skull-crossbones logo-icon"></i>
                <h1 class="main-title">DOOMSDAY PLANNER</h1>
                <div class="subtitle">Ultimate Survival System v2.0</div>
            </div>
            <div class="status-bar">
                <div class="status-item">
                    <i class="fas fa-signal"></i>
                    <span id="connectionStatus">ONLINE</span>
                </div>
                <div class="status-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span id="currentDate"></span>
                </div>
                <div class="status-item">
                    <i class="fas fa-thermometer-half"></i>
                    <span id="threatLevel">MODERATE</span>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <nav class="navigation" id="mainNav">
        <div class="nav-container">
            <button class="nav-btn active" data-tab="scenarios">
                <i class="fas fa-meteor"></i>
                <span>Scenarios</span>
            </button>
            <button class="nav-btn" data-tab="supplies">
                <i class="fas fa-boxes"></i>
                <span>Supplies</span>
            </button>
            <button class="nav-btn" data-tab="location">
                <i class="fas fa-map-marked-alt"></i>
                <span>Location</span>
            </button>
            <button class="nav-btn" data-tab="contacts">
                <i class="fas fa-users"></i>
                <span>Contacts</span>
            </button>
            <button class="nav-btn" data-tab="guides">
                <i class="fas fa-book"></i>
                <span>Guides</span>
            </button>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Scenarios Tab -->
        <section class="tab-content active" id="scenarios">
            <div class="container">
                <div class="scenario-generator">
                    <div class="card primary-card">
                        <div class="card-header">
                            <h2><i class="fas fa-dice"></i> Scenario Generator</h2>
                            <div class="difficulty-selector">
                                <label for="difficulty">Difficulty:</label>
                                <select id="difficulty" class="custom-select">
                                    <option value="easy">Manageable</option>
                                    <option value="medium" selected>Challenging</option>
                                    <option value="hard">Catastrophic</option>
                                    <option value="nightmare">Apocalyptic</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="scenario-display" id="scenarioDisplay">
                            <div class="scenario-placeholder">
                                <i class="fas fa-play-circle"></i>
                                <p>Click "Generate Scenario" to begin your survival analysis</p>
                            </div>
                        </div>
                        
                        <div class="scenario-actions">
                            <button class="btn primary-btn" onclick="generateScenario()">
                                <i class="fas fa-dice"></i> Generate Scenario
                            </button>
                            <button class="btn secondary-btn" onclick="generateDailyDoom()">
                                <i class="fas fa-calendar-day"></i> Daily Doomsday
                            </button>
                            <button class="btn danger-btn" onclick="escalateScenario()">
                                <i class="fas fa-exclamation-triangle"></i> Make It Worse
                            </button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3><i class="fas fa-edit"></i> Custom Scenario</h3>
                        <div class="input-group">
                            <input type="text" id="customScenario" class="custom-input" 
                                   placeholder="Describe your apocalyptic scenario...">
                            <button class="btn secondary-btn" onclick="generateCustomScenario()">
                                <i class="fas fa-wand-magic-sparkles"></i> Generate
                            </button>
                        </div>
                        
                        <div class="scenario-templates">
                            <h4>Quick Templates:</h4>
                            <div class="template-buttons">
                                <button class="template-btn" onclick="useTemplate('zombie')">Zombie Outbreak</button>
                                <button class="template-btn" onclick="useTemplate('nuclear')">Nuclear Winter</button>
                                <button class="template-btn" onclick="useTemplate('asteroid')">Asteroid Impact</button>
                                <button class="template-btn" onclick="useTemplate('pandemic')">Global Pandemic</button>
                                <button class="template-btn" onclick="useTemplate('ai')">AI Uprising</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="survival-analysis" id="survivalAnalysis" style="display: none;">
                    <div class="card">
                        <h3><i class="fas fa-chart-pie"></i> Survival Analysis</h3>
                        <div class="survival-meter">
                            <div class="meter-container">
                                <div class="meter-fill" id="survivalMeter"></div>
                                <div class="meter-text">
                                    <span id="survivalPercentage">0</span>%
                                </div>
                            </div>
                        </div>
                        
                        <div class="survival-factors">
                            <div class="factor">
                                <span>Preparation Level:</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" id="preparationFactor"></div>
                                </div>
                            </div>
                            <div class="factor">
                                <span>Location Safety:</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" id="locationFactor"></div>
                                </div>
                            </div>
                            <div class="factor">
                                <span>Resource Access:</span>
                                <div class="factor-bar">
                                    <div class="factor-fill" id="resourceFactor"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3><i class="fas fa-list-check"></i> Emergency Protocol</h3>
                        <div class="protocol-steps" id="protocolSteps"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Supplies Tab -->
        <section class="tab-content" id="supplies">
            <div class="container">
                <div class="supplies-header">
                    <h2><i class="fas fa-boxes"></i> Emergency Supply Management</h2>
                    <div class="family-size-selector">
                        <label for="familySize">Family Size:</label>
                        <input type="number" id="familySize" min="1" max="20" value="2" class="number-input">
                        <label for="duration">Duration (days):</label>
                        <input type="number" id="duration" min="1" max="365" value="14" class="number-input">
                    </div>
                </div>
                
                <div class="supplies-grid">
                    <div class="card supply-category" data-category="food">
                        <div class="category-header">
                            <h3><i class="fas fa-utensils"></i> Food & Water</h3>
                            <div class="progress-ring">
                                <div class="progress-value" id="foodProgress">0%</div>
                            </div>
                        </div>
                        <div class="supply-list" id="foodSupplies"></div>
                    </div>
                    
                    <div class="card supply-category" data-category="medical">
                        <div class="category-header">
                            <h3><i class="fas fa-first-aid"></i> Medical Supplies</h3>
                            <div class="progress-ring">
                                <div class="progress-value" id="medicalProgress">0%</div>
                            </div>
                        </div>
                        <div class="supply-list" id="medicalSupplies"></div>
                    </div>
                    
                    <div class="card supply-category" data-category="tools">
                        <div class="category-header">
                            <h3><i class="fas fa-tools"></i> Tools & Equipment</h3>
                            <div class="progress-ring">
                                <div class="progress-value" id="toolsProgress">0%</div>
                            </div>
                        </div>
                        <div class="supply-list" id="toolsSupplies"></div>
                    </div>
                    
                    <div class="card supply-category" data-category="shelter">
                        <div class="category-header">
                            <h3><i class="fas fa-home"></i> Shelter & Clothing</h3>
                            <div class="progress-ring">
                                <div class="progress-value" id="shelterProgress">0%</div>
                            </div>
                        </div>
                        <div class="supply-list" id="shelterSupplies"></div>
                    </div>
                </div>
                
                <div class="supplies-actions">
                    <button class="btn primary-btn" onclick="calculateSupplies()">
                        <i class="fas fa-calculator"></i> Recalculate Needs
                    </button>
                    <button class="btn secondary-btn" onclick="exportSupplyList()">
                        <i class="fas fa-download"></i> Export List
                    </button>
                    <button class="btn secondary-btn" onclick="resetSupplies()">
                        <i class="fas fa-redo"></i> Reset All
                    </button>
                </div>
            </div>
        </section>

        <!-- Location Tab -->
        <section class="tab-content" id="location">
            <div class="container">
                <div class="location-header">
                    <h2><i class="fas fa-map-marked-alt"></i> Location Assessment</h2>
                    <button class="btn secondary-btn" onclick="getCurrentLocation()">
                        <i class="fas fa-crosshairs"></i> Use Current Location
                    </button>
                </div>
                
                <div class="location-grid">
                    <div class="card">
                        <h3><i class="fas fa-search-location"></i> Location Input</h3>
                        <div class="location-input">
                            <input type="text" id="locationInput" class="custom-input" 
                                   placeholder="Enter city, state, or coordinates...">
                            <button class="btn primary-btn" onclick="analyzeLocation()">
                                <i class="fas fa-search"></i> Analyze
                            </button>
                        </div>
                        
                        <div class="location-info" id="locationInfo" style="display: none;">
                            <div class="info-item">
                                <strong>Current Location:</strong>
                                <span id="currentLocationText"></span>
                            </div>
                            <div class="info-item">
                                <strong>Coordinates:</strong>
                                <span id="coordinatesText"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3><i class="fas fa-exclamation-triangle"></i> Risk Assessment</h3>
                        <div class="risk-meters" id="riskMeters">
                            <div class="risk-item">
                                <span>Natural Disasters:</span>
                                <div class="risk-bar">
                                    <div class="risk-fill" id="naturalRisk"></div>
                                </div>
                                <span class="risk-level" id="naturalLevel">Unknown</span>
                            </div>
                            <div class="risk-item">
                                <span>Population Density:</span>
                                <div class="risk-bar">
                                    <div class="risk-fill" id="populationRisk"></div>
                                </div>
                                <span class="risk-level" id="populationLevel">Unknown</span>
                            </div>
                            <div class="risk-item">
                                <span>Infrastructure:</span>
                                <div class="risk-bar">
                                    <div class="risk-fill" id="infrastructureRisk"></div>
                                </div>
                                <span class="risk-level" id="infrastructureLevel">Unknown</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card evacuation-routes">
                        <h3><i class="fas fa-route"></i> Evacuation Planning</h3>
                        <div class="route-planning">
                            <div class="route-options">
                                <button class="route-btn" onclick="planRoute('north')">
                                    <i class="fas fa-arrow-up"></i> North Route
                                </button>
                                <button class="route-btn" onclick="planRoute('south')">
                                    <i class="fas fa-arrow-down"></i> South Route
                                </button>
                                <button class="route-btn" onclick="planRoute('east')">
                                    <i class="fas fa-arrow-right"></i> East Route
                                </button>
                                <button class="route-btn" onclick="planRoute('west')">
                                    <i class="fas fa-arrow-left"></i> West Route
                                </button>
                            </div>
                            <div class="route-info" id="routeInfo"></div>
                        </div>
                    </div>
                    
                    <div class="card safe-zones">
                        <h3><i class="fas fa-shield-alt"></i> Safe Zones</h3>
                        <div class="safe-zone-list" id="safeZoneList">
                            <p class="placeholder">Analyze your location to identify safe zones</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contacts Tab -->
        <section class="tab-content" id="contacts">
            <div class="container">
                <div class="contacts-header">
                    <h2><i class="fas fa-users"></i> Emergency Contacts</h2>
                    <button class="btn primary-btn" onclick="addContact()">
                        <i class="fas fa-user-plus"></i> Add Contact
                    </button>
                </div>
                
                <div class="contacts-grid">
                    <div class="card emergency-services">
                        <h3><i class="fas fa-phone"></i> Emergency Services</h3>
                        <div class="service-buttons">
                            <button class="service-btn emergency" onclick="callEmergency('911')">
                                <i class="fas fa-ambulance"></i>
                                <span>911</span>
                                <small>General Emergency</small>
                            </button>
                            <button class="service-btn fire" onclick="callEmergency('fire')">
                                <i class="fas fa-fire-extinguisher"></i>
                                <span>Fire Dept</span>
                                <small>Fire Emergency</small>
                            </button>
                            <button class="service-btn medical" onclick="callEmergency('medical')">
                                <i class="fas fa-user-md"></i>
                                <span>Medical</span>
                                <small>Poison Control</small>
                            </button>
                            <button class="service-btn police" onclick="callEmergency('police')">
                                <i class="fas fa-shield-alt"></i>
                                <span>Police</span>
                                <small>Non-Emergency</small>
                            </button>
                        </div>
                    </div>
                    
                    <div class="card personal-contacts">
                        <h3><i class="fas fa-address-book"></i> Personal Contacts</h3>
                        <div class="contact-list" id="contactList">
                            <div class="no-contacts">
                                <i class="fas fa-user-friends"></i>
                                <p>No emergency contacts added yet</p>
                                <button class="btn secondary-btn" onclick="addContact()">Add First Contact</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Guides Tab -->
        <section class="tab-content" id="guides">
            <div class="container">
                <div class="guides-header">
                    <h2><i class="fas fa-book"></i> Survival Guides</h2>
                    <div class="guide-search">
                        <input type="text" id="guideSearch" class="custom-input" 
                               placeholder="Search guides...">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
                
                <div class="guides-grid">
                    <div class="card guide-category" data-guide="basic">
                        <div class="guide-icon">
                            <i class="fas fa-hiking"></i>
                        </div>
                        <h3>Basic Survival</h3>
                        <p>Essential skills for wilderness survival</p>
                        <button class="btn secondary-btn" onclick="openGuide('basic')">
                            <i class="fas fa-book-open"></i> Read Guide
                        </button>
                    </div>
                    
                    <div class="card guide-category" data-guide="water">
                        <div class="guide-icon">
                            <i class="fas fa-tint"></i>
                        </div>
                        <h3>Water Procurement</h3>
                        <p>Finding and purifying water sources</p>
                        <button class="btn secondary-btn" onclick="openGuide('water')">
                            <i class="fas fa-book-open"></i> Read Guide
                        </button>
                    </div>
                    
                    <div class="card guide-category" data-guide="shelter">
                        <div class="guide-icon">
                            <i class="fas fa-campground"></i>
                        </div>
                        <h3>Shelter Building</h3>
                        <p>Constructing emergency shelters</p>
                        <button class="btn secondary-btn" onclick="openGuide('shelter')">
                            <i class="fas fa-book-open"></i> Read Guide
                        </button>
                    </div>
                    
                    <div class="card guide-category" data-guide="fire">
                        <div class="guide-icon">
                            <i class="fas fa-fire"></i>
                        </div>
                        <h3>Fire Starting</h3>
                        <p>Creating fire in any conditions</p>
                        <button class="btn secondary-btn" onclick="openGuide('fire')">
                            <i class="fas fa-book-open"></i> Read Guide
                        </button>
                    </div>
                    
                    <div class="card guide-category" data-guide="food">
                        <div class="guide-icon">
                            <i class="fas fa-apple-alt"></i>
                        </div>
                        <h3>Food Procurement</h3>
                        <p>Foraging and hunting techniques</p>
                        <button class="btn secondary-btn" onclick="openGuide('food')">
                            <i class="fas fa-book-open"></i> Read Guide
                        </button>
                    </div>
                    
                    <div class="card guide-category" data-guide="medical">
                        <div class="guide-icon">
                            <i class="fas fa-first-aid"></i>
                        </div>
                        <h3>First Aid</h3>
                        <p>Emergency medical procedures</p>
                        <button class="btn secondary-btn" onclick="openGuide('medical')">
                            <i class="fas fa-book-open"></i> Read Guide
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Floating Action Button -->
    <div class="fab-container">
        <button class="fab" id="mainFab" onclick="toggleFabMenu()">
            <i class="fas fa-cog"></i>
        </button>
        <div class="fab-menu" id="fabMenu">
            <button class="fab-item" onclick="toggleSound()" title="Toggle Sound">
                <i class="fas fa-volume-up" id="soundIcon"></i>
            </button>
            <button class="fab-item" onclick="toggleFullscreen()" title="Fullscreen">
                <i class="fas fa-expand"></i>
            </button>
            <button class="fab-item" onclick="shareApp()" title="Share">
                <i class="fas fa-share"></i>
            </button>
            <button class="fab-item" onclick="installApp()" title="Install App">
                <i class="fas fa-download"></i>
            </button>
        </div>
    </div>

    <!-- Modals -->
    <div class="modal" id="contactModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user-plus"></i> Add Emergency Contact</h3>
                <button class="close-btn" onclick="closeModal('contactModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="input-group">
                    <label for="contactName">Name:</label>
                    <input type="text" id="contactName" class="custom-input" placeholder="Enter contact name">
                </div>
                <div class="input-group">
                    <label for="contactPhone">Phone:</label>
                    <input type="tel" id="contactPhone" class="custom-input" placeholder="Enter phone number">
                </div>
                <div class="input-group">
                    <label for="contactRelation">Relationship:</label>
                    <select id="contactRelation" class="custom-select">
                        <option value="family">Family</option>
                        <option value="friend">Friend</option>
                        <option value="neighbor">Neighbor</option>
                        <option value="colleague">Colleague</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>
                        <input type="checkbox" id="contactPrimary"> Primary contact
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn secondary-btn" onclick="closeModal('contactModal')">Cancel</button>
                <button class="btn primary-btn" onclick="saveContact()">Save Contact</button>
            </div>
        </div>
    </div>

    <div class="modal" id="guideModal">
        <div class="modal-content large">
            <div class="modal-header">
                <h3 id="guideTitle"><i class="fas fa-book-open"></i> Survival Guide</h3>
                <button class="close-btn" onclick="closeModal('guideModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="guide-content" id="guideContent">
                    <!-- Guide content will be loaded here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container" id="toastContainer"></div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner">
            <i class="fas fa-skull-crossbones"></i>
            <p>Analyzing apocalyptic scenario...</p>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
