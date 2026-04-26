package com.example.Spring.Controller;

import com.example.Spring.Entity.Doctor;
import com.example.Spring.Service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired private DoctorService doctorService;

    @GetMapping
    public List<Doctor> getAll() {
        return doctorService.getAllDoctors();
    }

    @PostMapping
    public Doctor add(@RequestBody Doctor doctor) {
        return doctorService.addDoctor(doctor);
    }
}