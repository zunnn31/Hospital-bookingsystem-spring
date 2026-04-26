package com.example.Spring.Config;

import com.example.Spring.Entity.Doctor;
import com.example.Spring.Repositry.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public void run(String... args) {
        if (doctorRepository.count() == 0) {
            List<Doctor> doctors = List.of(
                    new Doctor("Dr. Sato Hiroshi", "Cardiology", "MD, PhD", 12, "Tokyo Medical University Hospital", 4.9),
                    new Doctor("Dr. Suzuki Yuki", "Neurology", "MD", 8, "Osaka General Hospital", 4.7),
                    new Doctor("Dr. Takahashi Kenji", "Orthopedics", "MD, MS", 15, "Kyoto City Hospital", 4.8),
                    new Doctor("Dr. Tanaka Mei", "Pediatrics", "MD", 10, "National Center for Child Health and Development", 4.9),
                    new Doctor("Dr. Watanabe Haruka", "Dermatology", "MD", 6, "Tokyo Dermatology Clinic", 4.6),
                    new Doctor("Dr. Ito Daichi", "Ophthalmology", "MD, PhD", 14, "Osaka Eye Hospital", 4.8),
                    new Doctor("Dr. Yamamoto Kenta", "ENT", "MD", 9, "Tokyo ENT Hospital", 4.5),
                    new Doctor("Dr. Nakamura Aoi", "Gynecology", "MD, MS", 11, "Kyoto Women's Hospital", 4.7),
                    new Doctor("Dr. Kobayashi Ryo", "Urology", "MD", 7, "Osaka Urology Center", 4.6),
                    new Doctor("Dr. Kato Sakura", "Gastroenterology", "MD, PhD", 13, "Tokyo Gastroenterology Hospital", 4.9)
            );
            doctorRepository.saveAll(doctors);
            System.out.println("✅ Seeded " + doctors.size() + " doctors!");
        }
    }
}