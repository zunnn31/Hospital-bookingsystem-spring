package com.example.Spring.Service;

import com.example.Spring.Entity.Appointment;
import com.example.Spring.Repositry.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class AppointmentService {

    @Autowired private AppointmentRepository appointmentRepository;

    public Appointment book(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    public Appointment getById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found!"));
    }

    public Appointment update(Long id, Appointment updated) {
        Appointment existing = getById(id);
        existing.setAppointmentDate(updated.getAppointmentDate());
        existing.setTimeSlot(updated.getTimeSlot());
        existing.setType(updated.getType());
        existing.setSymptoms(updated.getSymptoms());
        return appointmentRepository.save(existing);
    }

    public Appointment cancel(Long id) {
        Appointment appointment = getById(id);
        appointment.setStatus("CANCELLED");
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getByPatientEmail(String email) {
        return appointmentRepository.findByPatientEmail(email);
    }
}