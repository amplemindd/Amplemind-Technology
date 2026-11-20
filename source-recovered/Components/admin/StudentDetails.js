import "./StudentDetails.css";

function StudentDetails({ student, goBack }) {
  if (!student) {
    return (
      <div className="student-details-container">
        <div className="student-details-card">
          <h2>No Student Selected</h2>

          <button className="back-btn" onClick={goBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-details-container">
      <div className="student-details-header">
        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>

        <h2>Student Profile</h2>
      </div>

      <div className="student-profile-card">
        <div className="student-profile-left">
          {student.profileImage ? (
            <img
              src={`https://amplemindtechnologies.com${student.profileImage}`}
              alt={student.name}
              className="student-profile-image"
            />
          ) : (
            <div className="student-profile-placeholder">
              {student.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <h2>{student.name}</h2>

          <p>{student.course}</p>
        </div>

        <div className="student-profile-right">
          <div className="detail-box">
            <h3>Personal Information</h3>

            <div className="detail-grid">
              <div>
                <span>Name</span>

                <h4>{student.name}</h4>
              </div>

              <div>
                <span>Email</span>

                <h4>{student.email}</h4>
              </div>

              <div>
                <span>Phone</span>

                <h4>{student.phone}</h4>
              </div>

              <div>
                <span>Student ID</span>

                <h4>{student.studentId}</h4>
              </div>

              <div>
                <span>Gender</span>

                <h4>{student.gender}</h4>
              </div>

              <div>
                <span>Date of Birth</span>

                <h4>{student.dob}</h4>
              </div>
            </div>
          </div>
          <div className="detail-box">
            <h3>Course Information</h3>

            <div className="detail-grid">
              <div>
                <span>Course</span>

                <h4>{student.course}</h4>
              </div>

              <div>
                <span>Batch</span>

                <h4>{student.batch}</h4>
              </div>

              <div>
                <span>Roll Number</span>

                <h4>{student.rollNumber}</h4>
              </div>

              <div>
                <span>Qualification</span>

                <h4>{student.qualification}</h4>
              </div>

              <div>
                <span>College</span>

                <h4>{student.college}</h4>
              </div>

              <div>
                <span>Admission Date</span>

                <h4>{student.admissionDate}</h4>
              </div>
            </div>
          </div>

          <div className="detail-box">
            <h3>Address</h3>

            <div className="detail-grid">
              <div>
                <span>Address</span>

                <h4>{student.address}</h4>
              </div>

              <div>
                <span>City</span>

                <h4>{student.city}</h4>
              </div>

              <div>
                <span>State</span>

                <h4>{student.state}</h4>
              </div>

              <div>
                <span>Country</span>

                <h4>{student.country}</h4>
              </div>
            </div>
          </div>

          <div className="detail-box">
            <h3>Attendance</h3>

            <div className="detail-grid">
              <div>
                <span>Attendance</span>

                <h4>{student.attendance}%</h4>
              </div>

              <div>
                <span>Present Days</span>

                <h4>{student.presentDays}</h4>
              </div>

              <div>
                <span>Absent Days</span>

                <h4>{student.absentDays}</h4>
              </div>
            </div>
          </div>

          <div className="detail-box">
            <h3>Tests & Progress</h3>

            <div className="detail-grid">
              <div>
                <span>Total Tests</span>

                <h4>{student.totalTests}</h4>
              </div>

              <div>
                <span>Completed Tests</span>

                <h4>{student.completedTests}</h4>
              </div>

              <div>
                <span>Average Score</span>

                <h4>{student.averageScore}%</h4>
              </div>

              <div>
                <span>Progress</span>

                <h4>{student.progress}%</h4>
              </div>
            </div>
          </div>
          <div className="detail-box">
            <h3>Payment Details</h3>

            <div className="detail-grid">
              <div>
                <span>Payment Status</span>

                <h4>{student.paymentStatus}</h4>
              </div>

              <div>
                <span>Total Fees</span>

                <h4>₹{student.totalFees}</h4>
              </div>

              <div>
                <span>Paid Amount</span>

                <h4>₹{student.paidAmount}</h4>
              </div>

              <div>
                <span>Due Amount</span>

                <h4>₹{student.dueAmount}</h4>
              </div>
            </div>
          </div>

          <div className="detail-box">
            <h3>Certificates</h3>

            <div className="detail-grid">
              <div>
                <span>Certificate Status</span>

                <h4>{student.certificateStatus}</h4>
              </div>

              <div>
                <span>Total Certificates</span>

                <h4>{student.certificates}</h4>
              </div>

              <div>
                <span>Account Status</span>

                <h4>{student.status}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
