package com.example.Spring.Controller;

import com.example.Spring.Entity.Appointment;
import com.example.Spring.Entity.Doctor;
import com.example.Spring.Entity.User;
import com.example.Spring.Repositry.UserRepository;
import com.example.Spring.Repositry.DoctorRepository;
import com.example.Spring.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired private AppointmentService appointmentService;
    @Autowired private UserRepository userRepository;
    @Autowired private DoctorRepository doctorRepository;

    @PostMapping
    public ResponseEntity<?> book(@RequestBody Map<String, Object> body) {
        try {
            Appointment appointment = new Appointment();

            User patient = userRepository.findById(
                    Long.valueOf(body.get("patientId").toString())).orElseThrow();
            appointment.setPatient(patient);

            Doctor doctor = doctorRepository.findById(
                    Long.valueOf(body.get("doctorId").toString())).orElseThrow();
            appointment.setDoctor(doctor);

            appointment.setAppointmentDate(
                    java.time.LocalDate.parse(body.get("appointmentDate").toString()));
            appointment.setTimeSlot(body.get("timeSlot").toString());
            appointment.setType(body.get("type").toString());
            appointment.setSymptoms(body.get("symptoms") != null ?
                    body.get("symptoms").toString() : "");

            return ResponseEntity.ok(appointmentService.book(appointment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<Appointment> getAll(@RequestParam(required = false) String email) {
        if (email != null) return appointmentService.getByPatientEmail(email);
        return appointmentService.getAll();
    }

    @GetMapping("/{id}")
    public Appointment getById(@PathVariable Long id) {
        return appointmentService.getById(id);
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Long id, @RequestBody Appointment appointment) {
        return appointmentService.update(id, appointment);
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancel(@PathVariable Long id) {
        return appointmentService.cancel(id);
    }
}