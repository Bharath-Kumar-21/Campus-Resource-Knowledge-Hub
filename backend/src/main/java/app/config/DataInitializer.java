package app.config;

import app.entity.*;
import app.repository.*;
import app.service.HandoverService;
import app.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final RequestRepository requestRepository;
    private final BorrowingRepository borrowingRepository;
    private final DocumentRepository documentRepository;
    private final HandoverService handoverService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Verifying rich resources...");
            updateMissingResourceImages();
            return;
        }

        log.info("Starting CRKH initial database seed with rich campus resources...");

        // 1. Create Default Users
        User admin = User.builder()
                .name("Campus Administrator")
                .email("admin@college.edu")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .reputationScore(100)
                .build();
        admin = userRepository.save(admin);

        User mod = User.builder()
                .name("Faculty Moderator")
                .email("moderator@college.edu")
                .password(passwordEncoder.encode("Mod@123"))
                .role(Role.MODERATOR)
                .status(UserStatus.ACTIVE)
                .reputationScore(100)
                .build();
        mod = userRepository.save(mod);

        User student1 = User.builder()
                .name("Alex Rivera")
                .email("student1@college.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .reputationScore(95)
                .build();
        student1 = userRepository.save(student1);

        User student2 = User.builder()
                .name("Priya Sharma")
                .email("student2@college.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .reputationScore(100)
                .build();
        student2 = userRepository.save(student2);

        User student3 = User.builder()
                .name("Marcus Chen")
                .email("student3@college.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .reputationScore(88)
                .build();
        student3 = userRepository.save(student3);

        LocalDate today = LocalDate.now();

        // 2. Create Rich Physical Campus Resources with high-quality studio photography
        Resource calc = Resource.builder()
                .owner(student2)
                .title("Scientific Calculator - Casio fx-991EX ClassWiz")
                .description("High-resolution natural textbook display. Supports matrix calculations, vector operations, integration, differentiation, and statistical distributions.")
                .category(ResourceCategory.CALCULATOR)
                .location("Tech Park Block C, Room 304")
                .imageUrl("https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Like New")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(30))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(calc);

        Resource dbms = Resource.builder()
                .owner(student1)
                .title("Fundamentals of Database Systems (7th Edition) - Elmasri & Navathe")
                .description("Standard reference for SQL, relational algebra, normal forms (1NF through BCNF), transaction concurrency, and query indexing.")
                .category(ResourceCategory.TEXTBOOK)
                .location("Central Campus Library, 2nd Floor")
                .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Good")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(45))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(dbms);

        Resource javaBook = Resource.builder()
                .owner(student3)
                .title("Effective Java (3rd Edition) - Joshua Bloch")
                .description("Definitive guide to modern Java best practices: lambdas, functional interfaces, generics, defensive copying, and concurrency architecture.")
                .category(ResourceCategory.TEXTBOOK)
                .location("Computer Science Block B, Lab 102")
                .imageUrl("https://images.unsplash.com/photo-1532012164546-f432f2e3ddb5?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Brand New")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(90))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(javaBook);

        Resource adapter = Resource.builder()
                .owner(student3)
                .title("Anker 7-in-1 USB-C Hub Multiport Adapter (4K HDMI, PD 100W)")
                .description("Compact aluminum hub featuring 4K@60Hz HDMI output, 100W Power Delivery pass-through, SD card reader, and 2x USB 3.0 ports. Compatible with Mac, Dell, Lenovo.")
                .category(ResourceCategory.ADAPTER)
                .location("Student Activity Center / Cafeteria")
                .imageUrl("https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Like New")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(20))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(adapter);

        Resource hdmi = Resource.builder()
                .owner(student2)
                .title("Braided 4K High-Speed HDMI Presentation Cable (2m)")
                .description("Heavy-duty nylon braided 4K@60Hz HDMI cable. Ideal for connecting laptops to campus seminar projectors, displays, and auditorium stages.")
                .category(ResourceCategory.HDMI_CABLE)
                .location("ECE Department Hallway, Ground Floor")
                .imageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Like New")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(60))
                .status(ResourceStatus.AVAILABLE)
                .build();
        hdmi = resourceRepository.save(hdmi);

        Resource labKit = Resource.builder()
                .owner(student1)
                .title("Digital Oscilloscope Probe & Breadboard Electronics Lab Kit")
                .description("Includes 100MHz 10X/1X oscilloscope probes with BNC clips, transparent breadboard, jumper wire set, resistors, capacitors, and IC puller tool.")
                .category(ResourceCategory.LAB_EQUIPMENT)
                .location("Electronics Lab 2, Main Building")
                .imageUrl("https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Good")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(15))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(labKit);

        Resource notes = Resource.builder()
                .owner(student2)
                .title("Computer Networks & Protocols Comprehensive Handwritten Notes")
                .description("Spiral-bound comprehensive notes with color-coded diagrams: OSI layers, TCP three-way handshake, sliding window flow control, subnetting, and BGP/OSPF routing.")
                .category(ResourceCategory.NOTES)
                .location("Central Campus Library")
                .imageUrl("https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Clean & Spiral Bound")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(60))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(notes);

        Resource arduino = Resource.builder()
                .owner(student1)
                .title("Official Arduino Uno Rev3 Starter Kit with Sensor Modules")
                .description("Complete robotics starter kit including Arduino Uno R3, ultrasonic distance sensor, stepper motor, servo, LCD screen, and RFID reader.")
                .category(ResourceCategory.LAB_EQUIPMENT)
                .location("Robotics Innovation Hub, Mech Block")
                .imageUrl("https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Like New")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(40))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(arduino);

        Resource headphones = Resource.builder()
                .owner(student3)
                .title("Sony WH-1000XM4 Noise-Cancelling Study Headphones")
                .description("Industry-leading active noise cancelling headphones. Perfect for focused revision in busy hostel common rooms or quiet library sessions.")
                .category(ResourceCategory.ELECTRONICS)
                .location("Hostel Block B Study Lounge")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Like New")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(25))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(headphones);

        Resource sports = Resource.builder()
                .owner(student2)
                .title("Yonex Nanoray Carbon Fiber Badminton Racquet Set with Shuttles")
                .description("Pair of lightweight carbon graphite racquets with fresh gutting, carrying case, and a tube of 6 feather shuttlecocks for campus court sessions.")
                .category(ResourceCategory.SPORTS)
                .location("Campus Sports Complex Reception")
                .imageUrl("https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Good")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(30))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(sports);

        Resource stationery = Resource.builder()
                .owner(student1)
                .title("Professional Engineering Drawing Drafter & Compass Instrument Set")
                .description("Heavy-duty mini drafter with steel clamp, scale ruler, rotring technical pens, French curves, and stainless steel precision compass box.")
                .category(ResourceCategory.STATIONERY)
                .location("Civil Engineering Studio, Floor 1")
                .imageUrl("https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Brand New")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(50))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(stationery);

        Resource hostelItem = Resource.builder()
                .owner(student3)
                .title("Ergonomic Aluminum Laptop Riser & Cooling Stand")
                .description("Foldable 6-level adjustable laptop stand in brushed space gray aluminum. Elevates screen to eye level to prevent neck strain during long coding sessions.")
                .category(ResourceCategory.HOSTEL_ITEMS)
                .location("Hostel Block A, Room 214")
                .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80")
                .itemCondition("Like New")
                .availabilityFrom(today)
                .availabilityTo(today.plusDays(40))
                .status(ResourceStatus.AVAILABLE)
                .build();
        resourceRepository.save(hostelItem);

        // 3. Create Sample Resource Request for Intelligent Matching demonstration
        Request sampleReq = Request.builder()
                .requester(student1)
                .title("Need Database Systems Textbook for Midterm Review")
                .description("Preparing for DBMS midterm exam next week. Looking for Navathe or Korth textbook.")
                .category(ResourceCategory.TEXTBOOK)
                .keywords("DBMS database SQL normalization")
                .neededFrom(today.plusDays(1))
                .neededTo(today.plusDays(10))
                .location("Central Campus Library")
                .status(RequestStatus.OPEN)
                .build();
        sampleReq = requestRepository.save(sampleReq);

        // 4. Create Sample Active Borrowing with Handover & QR Token
        Borrowing sampleBorrowing = Borrowing.builder()
                .resource(hdmi)
                .borrower(student1)
                .startDate(today.minusDays(2))
                .endDate(today.plusDays(5))
                .status(BorrowingStatus.ACTIVE)
                .notes("Needed for final capstone presentation rehearsal in Seminar Hall.")
                .build();
        sampleBorrowing = borrowingRepository.save(sampleBorrowing);
        hdmi.setStatus(ResourceStatus.BORROWED);
        resourceRepository.save(hdmi);

        // Pre-generate active pickup handover token
        handoverService.generateQrToken(sampleBorrowing.getId(), HandoverType.PICKUP, student2);

        // 5. Create Sample Knowledge Vault Documents for student1
        Document doc1 = Document.builder()
                .owner(student1)
                .title("Database Normalization and BCNF Cheatsheet")
                .fileName("normalization_bcnf_cheatsheet.txt")
                .fileUri("uploads/documents/normalization_bcnf_cheatsheet.txt")
                .contentType("text/plain")
                .metadata("Database Systems, Semester 5 Exam Prep")
                .tags("database, normalization, bcnf, 3nf, functional-dependencies")
                .textContent("1NF: Atomic values only. 2NF: 1NF + No partial dependency on candidate keys. 3NF: 2NF + No transitive dependencies (X->A, X is superkey or A is prime). BCNF: For every functional dependency X->A, X must be a superkey.")
                .build();
        documentRepository.save(doc1);

        Document doc2 = Document.builder()
                .owner(student1)
                .title("Operating Systems Process Scheduling Algorithms")
                .fileName("os_process_scheduling.txt")
                .fileUri("uploads/documents/os_process_scheduling.txt")
                .contentType("text/plain")
                .metadata("Operating Systems Core Concepts")
                .tags("os, scheduling, round-robin, priority, turnaround-time")
                .textContent("Round Robin (RR) with time quantum Q. Shortest Job First (SJF) minimizes average waiting time. Multi-Level Feedback Queue dynamically adjusts priority based on CPU burst behavior.")
                .build();
        documentRepository.save(doc2);

        // 6. Notifications for student1
        notificationService.notifyUser(
                student1,
                "Intelligent Match Available!",
                "Your request 'Need Database Systems Textbook' has high-confidence resource matches on campus.",
                "/matches/" + sampleReq.getId()
        );

        notificationService.notifyUser(
                student1,
                "Active Borrowing Notice",
                "Your borrowing of 'Braided 4K High-Speed HDMI Presentation Cable (2m)' is ACTIVE. Return deadline: " + sampleBorrowing.getEndDate() + ".",
                "/borrowings"
        );

        log.info("CRKH initial database seed completed successfully with 12 rich resources!");
    }

    private void updateMissingResourceImages() {
        resourceRepository.findAll().forEach(r -> {
            boolean updated = false;
            String t = r.getTitle().toLowerCase();
            String matchedImage = null;

            if (t.contains("casio")) {
                matchedImage = "/images/products/casio_calculator.jpg";
            } else if (t.contains("ti-84") || t.contains("graphing")) {
                matchedImage = "/images/products/ti84_calculator.jpg";
            } else if (t.contains("calc")) {
                matchedImage = "/images/products/casio_calculator.jpg";
            } else if (t.contains("dbms") || t.contains("database")) {
                matchedImage = "/images/products/dbms_book.jpg";
            } else if (t.contains("java") || t.contains("programming")) {
                matchedImage = "/images/products/java_book.jpg";
            } else if (t.contains("hdmi") || t.contains("cable")) {
                matchedImage = "/images/products/hdmi_cable.jpg";
            } else if (t.contains("adapter") || t.contains("usb-c") || t.contains("hub")) {
                matchedImage = "/images/products/usbc_adapter.jpg";
            } else if (t.contains("oscilloscope") || t.contains("breadboard")) {
                matchedImage = "/images/products/breadboard_lab.jpg";
            } else if (t.contains("notes") || t.contains("network")) {
                matchedImage = "/images/products/network_notes.jpg";
            } else if (t.contains("arduino")) {
                matchedImage = "/images/products/arduino_kit.jpg";
            } else if (t.contains("headphone") || t.contains("sony")) {
                matchedImage = "/images/products/sony_headphones.jpg";
            } else if (t.contains("basketball") || t.contains("wilson") || t.contains("sport")) {
                matchedImage = "/images/products/basketball.jpg";
            } else if (t.contains("lamp") || t.contains("light") || t.contains("desk")) {
                matchedImage = "/images/products/desk_lamp.jpg";
            }

            if (matchedImage != null && !matchedImage.equals(r.getImageUrl())) {
                r.setImageUrl(matchedImage);
                updated = true;
            }
            if (r.getItemCondition() == null) {
                r.setItemCondition("Like New");
                updated = true;
            }
            if (updated) {
                resourceRepository.save(r);
            }
        });
    }
}
