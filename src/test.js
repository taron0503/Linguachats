/*<Dialog
				        open={this.props.show}
				        onClose={this.handleClose}
				        aria-labelledby="alert-dialog-title"
				        aria-describedby="alert-dialog-description"
				      >
				        <DialogTitle id="alert-dialog-title">{"Register"}</DialogTitle>
				        <DialogContent>

				            <InputLabel shrink htmlFor="user_name">
						          Name
						        </InputLabel>
						        <Input id="user_name"
						        			 name="name"
									         onChange={handleChange}
									         onBlur={handleBlur}
									      	 value = {values.name} />

									   <InputLabel shrink htmlFor="user_age">
						          Age
						        </InputLabel>
						        <Input id="user_age"
						        			 name="age"
									         onChange={handleChange}
									         onBlur={handleBlur}
									      	 value = {values.age} />

				         
				        </DialogContent>
				        <DialogActions>
				          <Button type="submit" color="primary">
				            NEXT
				          </Button>
				        </DialogActions>
				      </Dialog>*/
				/*<Modal show={this.props.show} onHide={this.handleClose}>
				          <form onSubmit={handleSubmit}>
		        <Modal.Header>
		          <Modal.Title>Register</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
		        	<InputGroup className="mb-3">
					    <InputGroup.Prepend>
					      <InputGroup.Text>Name</InputGroup.Text>
					    </InputGroup.Prepend>
					    <FormControl
					      placeholder="Username"
					      name="name"
					        onChange={handleChange}
					        onBlur={handleBlur}
					      value = {values.name}
					    />
				  	</InputGroup>
				  	{errors.name && touched.name && <p className="error">{errors.name}</p>}
				  	<InputGroup className="mb-3">
					    <InputGroup.Prepend>
					      <InputGroup.Text>Age</InputGroup.Text>
					    </InputGroup.Prepend>
					    <FormControl
					      type="number"
					      name="age"
					        onChange={handleChange}
					        onBlur={handleBlur}
					      value = {values.age}
					    />
				  	</InputGroup>
				  	{errors.age && touched.age && <p className="error">{errors.age}</p>}
				  	<InputGroup className="mb-3">
					    <InputGroup.Prepend>
					      <InputGroup.Text>Gender</InputGroup.Text>
					    </InputGroup.Prepend>
					    
						    <FormControl className="selectpicker" as="select"
						    							name="gender"
						    							onChange={handleChange}
					      							onBlur={handleBlur}
					      							value = {[values.gender]}
						    							>
						      <option>male</option>
						      <option>female</option>
						    </FormControl>
						  
					   
				  	</InputGroup>
				  	<InputGroup className="mb-3">
					    <InputGroup.Prepend>
					      <InputGroup.Text>Country</InputGroup.Text>
					    </InputGroup.Prepend>
					    <FormControl
					    	name="country"
					      onChange={handleChange}
					      onBlur={handleBlur}
					      value = {values.country}
					    />
				  	</InputGroup>
				  	<InputGroup className="mb-3">
					    <InputGroup.Prepend>
					      <InputGroup.Text>Language you speak</InputGroup.Text>
					    </InputGroup.Prepend>
					    <FormControl
					    	name="speaks"
					      onChange={handleChange}
					      onBlur={handleBlur}
					      value = {values.speaks}
					    />
				  	</InputGroup>
				  	<InputGroup className="mb-3">
					    <InputGroup.Prepend>
					      <InputGroup.Text>Language you want to learn</InputGroup.Text>
					    </InputGroup.Prepend>
					    <FormControl
					    	name="learn"
					      onChange={handleChange}
					      onBlur={handleBlur}
					      value = {values.learn}
					    />
				  	</InputGroup>
		        </Modal.Body>
		        <Modal.Footer>
		          <Button type="submit" variant="primary" disabled={isSubmitting}>
		            Next
		          </Button>
		        </Modal.Footer>
		        </form>
		      </Modal>*/